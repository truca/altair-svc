import { Profile } from "../types";

// The strings can include the following items
// 0. "public"
// 1. "owner"
// 2. "collaborator"
// 3. "role:admin": this can do full CRUD
// 4. "role:editor": this can do everything except delete
// 5. "role:viewer": this can only read
// 6. "role:custom"
// 7. "owner|chats:chatId": In this case, we're going to get access if we're the owner of the chat with chatId
// 8. "collaborator|bills:billId": In this case, we're going to get access if we're the collaborator of the chat with chatId
export interface AuthConfig {
  create: [string];
  read: [string];
  update: [string];
  delete: [string];
}

export interface EntityPermissions {
  ownerIds: [string];
  collaboratorIds: [string];
}

export enum ActionTypes {
  create = "create",
  read = "read",
  update = "update",
  delete = "delete",
}

const DEFAULT_PERMISSIONS_PER_ACTION: AuthConfig = {
  create: ["public"],
  read: ["owner"],
  update: ["owner"],
  delete: ["owner"],
};

export function extractDirectiveParams(astNode: any, directiveName: string) {
  const directiveParams: any = {};

  // Iterate over the directives in the AST node
  astNode?.directives.forEach((directive: any) => {
    if (directive.name.value === directiveName) {
      directive.arguments.forEach((arg: any) => {
        // Get the argument name
        const argName = arg.name.value;

        // Get the values of the argument (assuming ListValue)
        if (arg.value.kind === "ListValue") {
          directiveParams[argName] = arg.value.values.map(
            (val: any) => val.value
          );
        }
      });
    }
  });

  return directiveParams;
}

export function extractFieldDirectiveParams(
  astNode: any,
  fieldName: string,
  directiveName: string
) {
  // Find the field by name
  const field = astNode.fields.find((f: any) => f.name.value === fieldName);

  // If field doesn't exist, return null
  if (!field) {
    return null;
  }

  // Find the directive on the field
  const directive = field.directives.find(
    (d: any) => d.name.value === directiveName
  );

  // If directive doesn't exist, return null
  if (!directive) {
    return null;
  }

  // Convert directive arguments into a key-value object
  const directiveParams: any = {};
  directive.arguments.forEach((arg: any) => {
    if (arg.value.kind === "ListValue") {
      directiveParams[arg.name.value] = arg.value.values.map(
        (v: any) => v.value
      );
    } else {
      directiveParams[arg.name.value] = arg.value.value;
    }
  });

  return directiveParams;
}

export function getEntityTypeFromField(astNode: any, fieldName: string) {
  // Find the field in the fields array
  const field = astNode.fields.find((f: any) => f.name.value === fieldName);

  // Check if the field exists
  if (!field) {
    return null;
  }

  // Navigate through the type to get the NamedType, which contains the entity type
  let fieldType = field.type;

  // If the type is a List or NonNull, drill down to the inner type
  while (fieldType.kind === "ListType" || fieldType.kind === "NonNullType") {
    fieldType = fieldType.type;
  }

  // Return the name of the type (the entity type)
  return fieldType.name.value;
}

export function getFieldType(astNode: any, fieldName: string) {
  // Find the field by name
  const field = astNode.fields.find((f: any) => f.name.value === fieldName);

  // If field doesn't exist, return null
  if (!field) {
    return null;
  }

  // Get the named type (recursively, in case it's a NonNull or List type)
  function getNamedType(type: any) {
    if (type.kind === "NamedType") {
      return type.name.value;
    }
    if (type.kind === "NonNullType" || type.kind === "ListType") {
      return getNamedType(type.type);
    }
    return null;
  }

  const fieldType = getNamedType(field.type);

  // Map GraphQL types to desired output types
  switch (fieldType) {
    case "String":
      return "text";
    case "Int":
    case "Float":
      return "number";
    case "Boolean":
      return "boolean";
    case "ID":
      return "text"; // IDs are typically treated as strings
    default:
      // If it's an array, return "array"
      if (field.type.kind === "ListType") {
        return "array";
      }
      // Otherwise, it's an object (custom types, etc.)
      return "object";
  }
}

function getConfigForActionOrDefault({
  entityAuthConfig,
  action,
}: {
  entityAuthConfig: AuthConfig;
  action: ActionTypes;
}) {
  return entityAuthConfig?.[action] ?? DEFAULT_PERMISSIONS_PER_ACTION[action];
}

export function getHasPermissionThroughRoles({
  entityAuthConfig,
  profile,
  action,
}: {
  entityAuthConfig: AuthConfig;
  profile?: Profile;
  action: ActionTypes;
}) {
  const configForAction = getConfigForActionOrDefault({
    entityAuthConfig,
    action,
  });
  const userRoles = profile?.roles ?? [];
  const userHasRoles = Boolean(userRoles.length);

  const rolePermissionsInConfig = configForAction.filter((role) =>
    role.startsWith("role:")
  );
  const hasRolePermissionsInConfig = Boolean(rolePermissionsInConfig.length);

  const hasPermissionThroughRoles =
    userHasRoles &&
    hasRolePermissionsInConfig &&
    userRoles.some((role) => rolePermissionsInConfig.includes(`role:${role}`));

  return hasPermissionThroughRoles;
}

export function getHasOnlyRolePermissionsInConfig(
  config: AuthConfig,
  action: ActionTypes
) {
  const configForAction = getConfigForActionOrDefault({
    entityAuthConfig: config,
    action,
  });
  return configForAction.every((role) => role.startsWith("role:"));
}

export function getHasPublicPermissionsInConfig(
  config: AuthConfig,
  action: ActionTypes
) {
  const configForAction = getConfigForActionOrDefault({
    entityAuthConfig: config,
    action,
  });
  return configForAction.includes("public");
}

export function getHasNecessaryRolePermissionsToContinue(
  config: AuthConfig,
  profile: Profile,
  action: ActionTypes
) {
  const hasPublicPermission = getHasPublicPermissionsInConfig(config, action);
  if (hasPublicPermission) return true;

  const hasOnlyRolePermissions = getHasOnlyRolePermissionsInConfig(
    config,
    action
  );
  const hasPermissionThroughRoles = getHasPermissionThroughRoles({
    entityAuthConfig: config,
    profile,
    action,
  });

  return !hasOnlyRolePermissions || hasPermissionThroughRoles;
}

export function getHasOwnerPermissionInConfig({
  config,
  action,
}: {
  config: AuthConfig;
  action: ActionTypes;
}) {
  const configForAction = getConfigForActionOrDefault({
    entityAuthConfig: config,
    action,
  });

  const hasOwnerPermission = configForAction.includes("owner");
  return hasOwnerPermission;
}

export function getHasOwnerPermissionThroughAnotherEntityInConfig({
  config,
  action,
}: {
  config: AuthConfig;
  action: ActionTypes;
}) {
  const configForAction = getConfigForActionOrDefault({
    entityAuthConfig: config,
    action,
  });
  const hasOwnerPermissionThroughAnotherEntity = configForAction.some((role) =>
    role.startsWith("owner|")
  );
  return hasOwnerPermissionThroughAnotherEntity;
}

export function getHasCollaboratorPermissionInConfig({
  config,
  action,
}: {
  config: AuthConfig;
  action: ActionTypes;
}) {
  const configForAction = getConfigForActionOrDefault({
    entityAuthConfig: config,
    action,
  });
  const hasCollaboratorPermission = configForAction.includes("collaborator");
  return hasCollaboratorPermission;
}

export function getHasCollaboratorPermissionThroughAnotherEntityInConfig({
  config,
  action,
}: {
  config: AuthConfig;
  action: ActionTypes;
}) {
  const configForAction = getConfigForActionOrDefault({
    entityAuthConfig: config,
    action,
  });
  const hasCollaboratorPermissionThroughAnotherEntity = configForAction.some(
    (role) => role.startsWith("collaborator|")
  );
  return hasCollaboratorPermissionThroughAnotherEntity;
}

export function getMongoFilterForOwnerOrCollaborator({
  config,
  profile,
  action,
}: {
  config: AuthConfig;
  profile: Profile;
  action: ActionTypes;
}) {
  const hasOwnerPermissionInConfig = getHasOwnerPermissionInConfig({
    config,
    action,
  });
  const hasCollaboratorPermissionInConfig =
    getHasCollaboratorPermissionInConfig({ config, action });

  if (hasOwnerPermissionInConfig && hasCollaboratorPermissionInConfig) {
    return {
      $or: [{ ownerIds: profile.uid }, { collaboratorIds: profile.uid }],
    };
  }

  if (hasOwnerPermissionInConfig) {
    return { ownerIds: profile.uid };
  }

  if (hasCollaboratorPermissionInConfig) {
    return { collaboratorIds: profile.uid };
  }

  return {};
}

export function getHasPermissionOnlyThroughAnotherEntity({
  config,
  action,
}: {
  config: AuthConfig;
  action: ActionTypes;
}) {
  const configForAction = getConfigForActionOrDefault({
    entityAuthConfig: config,
    action,
  });

  return configForAction.every((role) => role.includes("|"));
}
