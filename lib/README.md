# Retail Media Library

A comprehensive GraphQL utilities and directives library for retail media services.

## Installation

```bash
npm install @your-org/retail-media-lib
```

## Features

- **GraphQL Directives**: Model, Auth, and Static Model directives
- **Database Stores**: Firestore and PostgreSQL support
- **Authentication**: JWT token management and verification
- **Form Generation**: Dynamic form generation from GraphQL schemas
- **File Handling**: File upload and serving utilities
- **TypeScript Support**: Full TypeScript definitions included

## Quick Start

```typescript
import {
  createContext,
  makeSchema,
  ModelDirective,
  AuthDirective,
} from "@your-org/retail-media-lib";

// Create a GraphQL schema with directives
const schema = makeSchema({
  typeDefs: `
    type User @model {
      id: ID!
      email: String!
      name: String!
    }
    
    type Query {
      users: [User!]! @auth
    }
  `,
  formTypes: {
    User: "user",
  },
});

// Create context with database connections
const context = createContext(schema);
```

## API Reference

### Core Functions

#### `createContext(schema)`

Creates a GraphQL context with database connections and directives.

#### `makeSchema(options)`

Creates a GraphQL schema with form generation capabilities.

#### `verifyToken(token, secret)`

Verifies JWT tokens and returns decoded payload or error.

#### `generateTokens(profile)`

Generates access and refresh tokens for a user profile.

### Directives

#### `@model`

Marks a GraphQL type for automatic CRUD operations and form generation.

#### `@auth`

Protects resolvers with authentication requirements.

#### `@static`

Creates static data models with predefined values.

### Stores

#### `FirestoreStore`

Google Firestore database store implementation.

#### `PostgresStore`

PostgreSQL database store implementation.

## Configuration

Set the following environment variables:

```env
DB_ENGINE=firestore|postgres
DB_INTERNAL_NAME=your_db_name
FIRESTORE_DB_NAME=your_firestore_db_name
JWT_SECRET=your_jwt_secret
ACCESS_TOKEN_DURATION_SECONDS=3600
REFRESH_TOKEN_DURATION_SECONDS=604800
```

## Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Watch for changes
npm run dev

# Clean build artifacts
npm run clean
```

## License

MIT
