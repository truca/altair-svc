# Altair Service

A GraphQL-based service that automatically generates forms, queries, mutations, and resolvers from GraphQL schema directives. The service provides a powerful abstraction layer for building dynamic forms and CRUD operations with built-in authentication and authorization.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Directives System](#directives-system)
- [Automatic Generation](#automatic-generation)
- [Authentication & Authorization](#authentication--authorization)
- [Stores & Database Layer](#stores--database-layer)
- [Form Generation](#form-generation)
- [API Reference](#api-reference)
- [Configuration](#configuration)

## Overview

The Altair Service is built around a directive-driven architecture that automatically generates:

- **Forms**: Dynamic form schemas based on GraphQL type definitions
- **Queries**: CRUD operations (find, findOne) for each model
- **Mutations**: CRUD operations (create, update, remove) for each model
- **Resolvers**: Automatic resolver generation with nested object handling
- **Input Types**: Generated input types for mutations and queries
- **Authorization**: Role-based access control with fine-grained permissions

## Architecture

### Core Components

```
altair-svc/
├── lib/
│   ├── ModelDirective/     # Automatic CRUD generation
│   ├── AuthDirective/      # Permission system
│   ├── StaticModelDirective/ # Static model handling
│   ├── stores/            # Database abstraction layer
│   ├── utils/             # Core utilities and form generation
│   └── types.ts           # TypeScript definitions
├── src/
│   ├── schema.ts          # GraphQL schema definition
│   └── main.ts           # Service entry point
```

### Key Features

- **Directive-Driven**: Uses GraphQL directives to define behavior
- **Database Agnostic**: Supports multiple database engines (Firestore, PostgreSQL)
- **Auto-Generated Forms**: Creates dynamic forms from schema definitions
- **Role-Based Access Control**: Fine-grained permission system
- **Nested Object Support**: Handles complex nested relationships
- **File Upload Support**: Built-in file handling with validation

## Directives System

The service uses GraphQL directives to define behavior and generate functionality automatically.

### Core Directives

#### @model

Defines a GraphQL type as a database model with automatic CRUD operations.

```graphql
type Campaign @model(db: "firestore", table: "campaigns") {
  id: ID!
  name: String!
  startDate: DateTime!
  endDate: DateTime!
}
```

**Parameters:**

- `db`: Database engine to use (default: "store")
- `table`: Collection/table name (optional)

**Generated Operations:**

- `createCampaign(data: CampaignInput!): Campaign`
- `updateCampaign(data: CampaignInput!, where: CampaignInput!, upsert: Boolean): Campaign`
- `removeCampaign(where: CampaignInput!): Boolean`
- `findOneCampaign(where: CampaignInput!): Campaign`
- `findCampaignList(where: CampaignInput!, page: Int, pageSize: Int, includeMaxPages: Boolean): CampaignList`

#### @auth

Defines permission rules for CRUD operations.

```graphql
type Campaign
  @model
  @auth(
    create: ["public"]
    read: ["owner", "collaborator", "role:admin"]
    update: ["owner", "role:admin", "role:editor"]
    delete: ["owner", "role:admin"]
  ) {
  id: ID!
  ownerIds: [String!]!
  collaboratorIds: [String!]!
}
```

**Permission Types:**

- `"public"`: Anyone can access
- `"owner"`: Only owners can access
- `"collaborator"`: Owners and collaborators can access
- `"role:admin"`: Users with admin role
- `"role:editor"`: Users with editor role
- `"role:viewer"`: Users with viewer role
- `"owner|entity:entityId"`: Conditional ownership through relationships

#### @file

Defines file upload fields with validation.

```graphql
type Campaign {
  mediaPlan: File @file(maxSize: 1000000, types: ["image/jpeg", "image/png"])
}
```

**Parameters:**

- `maxSize`: Maximum file size in bytes
- `types`: Allowed MIME types

#### @selectFrom / @selectManyFrom

Defines select fields with options from database or static values.

```graphql
type Campaign {
  # Static options
  status: String @selectFrom(values: ["draft", "active", "completed"])

  # Database options
  productManagerId: String
    @selectFrom(
      table: "productManagers"
      labelAttribute: "name"
      valueAttribute: "externalId"
    )

  # Multi-select with dependencies
  brandIds: [String!]
    @selectManyFrom(
      table: "brands"
      labelAttribute: "name"
      valueAttribute: "externalId"
      dependentField: "sellerId"
    )
}
```

#### @hidden

Controls field visibility in forms.

```graphql
type Campaign {
  # Always hidden
  internalId: String @hidden(value: true)

  # Conditionally hidden
  budget: Float @hidden(cond: [{ field: "campaignType", valueString: "free" }])
}
```

#### @position

Defines form layout positioning for multi-step forms.

```graphql
type Campaign {
  name: String @position(step: 1, row: 1) @meta(label: "Campaign Name")
  startDate: DateTime @position(step: 1, row: 2) @meta(label: "Start Date")
}
```

#### @meta

Provides form metadata like labels and placeholders.

```graphql
type Campaign {
  name: String @meta(label: "Campaign Name", placeholder: "Enter campaign name")
}
```

#### @default

Sets default values for fields.

```graphql
type Campaign {
  status: String @default(value: "draft")
  createdAt: DateTime @default(value: "now")
}
```

#### @from

Inherits values from parent objects.

```graphql
type SponsoredProduct {
  campaignId: ID @from(parentAttribute: "id")
  startDate: DateTime @from(parentAttribute: "startDate")
}
```

### Subform Directives

#### @subform

Defines nested form objects.

```graphql
type Campaign {
  banner: Banner @subform(layout: CARDS)
}
```

#### @polymorphicSubform

Defines polymorphic nested forms with type selection.

```graphql
type Campaign {
  subProducts: [CRMSubProductUnion]
    @polymorphicSubform(
      types: ["CRMEmail", "CRMTrigger", "CRMBanner"]
      layout: TABS
    )
}
```

#### @polymorphicArray

Defines arrays of polymorphic objects.

```graphql
type Campaign {
  strategies: [StrategyUnion]
    @polymorphicArray(
      types: ["EmailStrategy", "SMSStrategy", "PushStrategy"]
      addButtonText: "Add Strategy"
      layout: CARDS
    )
}
```

## Automatic Generation

### Input Types

The service automatically generates input types for all model fields:

```graphql
# Generated from Campaign type
input CampaignInput {
  id: ID
  name: String
  startDate: DateTime
  endDate: DateTime
  # ... other fields
}
```

### Queries

For each `@model` type, the service generates:

```graphql
type Query {
  # Find single record
  findOneCampaign(where: CampaignInput!): Campaign

  # Find multiple records with pagination
  findCampaignList(
    where: CampaignInput!
    page: Int
    pageSize: Int
    includeMaxPages: Boolean
  ): CampaignList
}
```

### Mutations

For each `@model` type, the service generates:

```graphql
type Mutation {
  # Create new record
  createCampaign(data: CampaignInput!): Campaign

  # Update existing record
  updateCampaign(
    data: CampaignInput!
    where: CampaignInput!
    upsert: Boolean
  ): Campaign

  # Delete record
  removeCampaign(where: CampaignInput!): Boolean
}
```

### Resolvers

Resolvers are automatically generated with:

- **Nested Object Handling**: Recursively processes nested objects
- **File Upload Processing**: Handles file uploads and storage
- **Validation**: Input validation based on schema
- **Authorization**: Permission checks before operations
- **Pagination**: Built-in pagination for list queries

## Authentication & Authorization

### Authentication System

The service uses JWT tokens for authentication:

```typescript
// Token generation
const tokens = generateTokens(profile);
// Returns { accessToken, refreshToken }

// Token verification
const result = verifyToken(token, secret);
// Returns { decoded, error }
```

### Authorization System

The `@auth` directive provides role-based access control:

#### Permission Levels

1. **Public Access**: `"public"` - No authentication required
2. **Owner Access**: `"owner"` - User must be in `ownerIds` array
3. **Collaborator Access**: `"collaborator"` - User must be in `collaboratorIds` array
4. **Role-Based Access**: `"role:admin"`, `"role:editor"`, `"role:viewer"`
5. **Conditional Access**: `"owner|entity:entityId"` - Access through relationships

#### Permission Checking

```typescript
// Check if user has permission for action
const hasPermission = getHasPermissionThroughRoles({
  entityAuthConfig: authConfig,
  profile: userProfile,
  action: ActionTypes.read,
});
```

#### Database Filters

The service automatically generates database filters based on permissions:

```typescript
// MongoDB filter
const filter = getMongoFilterForOwnerOrCollaborator({
  config: authConfig,
  profile: userProfile,
  action: ActionTypes.read,
});
// Returns: { $or: [{ ownerIds: userEmail }, { collaboratorIds: userEmail }] }

// SQL filter
const filter = getSQLFilterForOwnerOrCollaborator(
  authConfig,
  userProfile,
  ActionTypes.read
);
// Returns: "ownerIds = ? OR collaboratorIds = ?"
```

## Stores & Database Layer

### Store Interface

The service uses a database-agnostic store interface:

```typescript
interface Store {
  find(
    props: StoreFindProps,
    context: Context,
    info: any
  ): Promise<StoreFindReturn>;
  findOne(
    props: StoreFindOneProps,
    context: Context,
    info: any
  ): Promise<StoreFindOneReturn>;
  create(
    props: StoreCreateProps,
    context: Context,
    info: any
  ): Promise<StoreCreateReturn>;
  update(
    props: StoreUpdateProps,
    context: Context,
    info: any
  ): Promise<StoreUpdateReturn>;
  remove(
    props: StoreRemoveProps,
    context: Context,
    info: any
  ): Promise<StoreRemoveReturn>;
}
```

### Supported Databases

#### Firestore Store

```typescript
// Firestore configuration
const firestoreOptions = {
  name: process.env.FIRESTORE_DB_NAME,
  // Firebase admin SDK configuration
};

const store = new FirestoreStore(firestoreOptions);
```

**Features:**

- Automatic ID generation
- Soft delete support
- Timestamp handling
- Collection-based queries

#### PostgreSQL Store

```typescript
// PostgreSQL configuration
const postgresOptions = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

const store = new PostgresStore(postgresOptions);
```

**Features:**

- SQL query generation
- Transaction support
- Relationship handling
- Index optimization

### Store Factory

```typescript
// Create store based on configuration
const store = createStore(process.env.DB_ENGINE as DbTypes, dbOptions, schema);
```

## Form Generation

### Dynamic Form Generation

The service automatically generates form schemas from GraphQL types:

```typescript
// Generate form from type
const form = await generateFieldsFromType(schema, "Campaign");
```

### Field Types

The service supports various field types:

- **Basic Types**: TEXT, NUMBER, EMAIL, PASSWORD, CHECKBOX, RADIO
- **Select Types**: SELECT, MULTISELECT, SMART_SELECT
- **Date Types**: DATE, TIME, DATETIME
- **File Types**: FILE, IMAGE
- **Subform Types**: SUBFORM, POLYMORPHIC_SUBFORM, POLYMORPHIC_ARRAY

### Form Layout

Forms support multi-step layouts with CSS Grid:

```typescript
interface FormStep {
  stepNumber: number;
  gridTemplateAreas: string;
  gridTemplateColumns: string;
}
```

### Field Properties

Each field includes:

```typescript
interface Field {
  id: string;
  label: string;
  type: FieldType;
  defaultValue?: any;
  options?: FieldOption[];
  validation?: FieldValidation[];
  placeholder?: string;
  hidden?: string; // JSON stringified conditions
  step?: number;
  row?: number;
  // Smart select properties
  entity?: string;
  labelAttribute?: string;
  valueAttribute?: string;
  dependentField?: string;
  isMulti?: boolean;
  // Subform properties
  subformType?: string;
  subformTypes?: string[];
  subformFields?: Field[];
  subformLayout?: "cards" | "tabs";
}
```

### Validation

Automatic validation generation:

```typescript
// Generate validation rules
const validation = generateValidation(field);
// Returns: [{ label: "required", value: "true", errorMessage: "Field is required" }]
```

## API Reference

### Core Functions

#### makeSchema

Creates a GraphQL schema with automatic generation.

```typescript
const schema = makeSchema({
  typeDefs: graphqlSchema,
  formTypes: { CAMPAIGN: "campaign" },
  queries: customQueries,
  mutations: customMutations,
});
```

#### createContext

Creates GraphQL context with database connections.

```typescript
const context = createContext(schema, entityMapper);
```

#### makeContext

Creates base context with database connections.

```typescript
const context = makeContext({ context: {}, schema });
```

### Form Query

```graphql
query GetForm($type: String!) {
  form(type: $type) {
    fields {
      id
      label
      type
      defaultValue
      options {
        label
        value
      }
      validation {
        label
        value
        errorMessage
      }
      step
      row
      placeholder
      hidden
      entity
      labelAttribute
      valueAttribute
      dependentField
      isMulti
      subformType
      subformTypes
      subformLayout
      addButtonText
      typeOptions {
        label
        value
      }
    }
    steps {
      stepNumber
      gridTemplateAreas
      gridTemplateColumns
    }
  }
}
```

### Authentication Mutations

```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    country
  }
}

mutation Register($email: String!, $password: String!, $username: String) {
  register(email: $email, password: $password, username: $username) {
    token
    country
  }
}
```

## Configuration

### Environment Variables

```bash
# Database Configuration
DB_ENGINE=firestore
DB_INTERNAL_NAME=store
FIRESTORE_DB_NAME=your-firestore-db

# JWT Configuration
JWT_SECRET=your-jwt-secret
ACCESS_TOKEN_DURATION_SECONDS=3600
REFRESH_TOKEN_DURATION_SECONDS=604800

# File Upload
MAX_FILE_SIZE=1000000
ALLOWED_FILE_TYPES=image/jpeg,image/png,application/pdf
```

### Schema Configuration

```typescript
// Define form types mapping
const formTypes: FormTypes = {
  CAMPAIGNGROUP: "campaignGroup",
  CAMPAIGN: "campaign",
  SELLER: "seller",
  BRAND: "brand",
  CATEGORY: "category",
  SUBCATEGORY: "subcategory",
  PRODUCTMANAGER: "productManager",
};
```

### Custom Resolvers

```typescript
// Add custom queries
const customQueries = {
  customQuery: () => ({ result: "custom" }),
};

// Add custom mutations
const customMutations = {
  customMutation: () => ({ success: true }),
};

const schema = makeSchema({
  typeDefs,
  formTypes,
  queries: customQueries,
  mutations: customMutations,
});
```

## Usage Examples

### Basic Model Definition

```graphql
type Campaign
  @model
  @auth(
    create: ["public"]
    read: ["owner", "collaborator"]
    update: ["owner"]
    delete: ["owner"]
  ) {
  id: ID!
  name: String! @position(step: 1, row: 1) @meta(label: "Campaign Name")
  startDate: DateTime! @position(step: 1, row: 2) @meta(label: "Start Date")
  endDate: DateTime! @position(step: 1, row: 3) @meta(label: "End Date")
  status: String @selectFrom(values: ["draft", "active", "completed"])
  ownerIds: [String!]! @hidden(value: true)
  collaboratorIds: [String!]! @hidden(value: true)
}
```

### Complex Form with Subforms

```graphql
type Campaign @model {
  id: ID!
  name: String!

  # Nested form
  banner: Banner @subform(layout: CARDS)

  # Polymorphic array
  strategies: [StrategyUnion]
    @polymorphicArray(
      types: ["EmailStrategy", "SMSStrategy"]
      addButtonText: "Add Strategy"
      layout: TABS
    )
}

type Banner {
  title: String!
  image: File @file(maxSize: 5000000, types: ["image/jpeg", "image/png"])
}

type EmailStrategy {
  subject: String!
  template: String!
}

type SMSStrategy {
  message: String!
  phoneNumber: String!
}

union StrategyUnion = EmailStrategy | SMSStrategy
```

### Smart Select with Dependencies

```graphql
type Campaign @model {
  id: ID!

  # Seller selection
  sellerId: String!
    @selectFrom(
      table: "sellers"
      labelAttribute: "name"
      valueAttribute: "externalId"
    )
    @position(step: 1, row: 1)

  # Brand selection (depends on seller)
  brandIds: [String!]!
    @selectManyFrom(
      table: "brands"
      labelAttribute: "name"
      valueAttribute: "externalId"
      dependentField: "sellerId"
    )
    @position(step: 1, row: 2)
}
```

This service provides a powerful foundation for building dynamic, form-driven applications with automatic CRUD operations, role-based access control, and flexible database support.
