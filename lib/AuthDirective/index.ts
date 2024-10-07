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
