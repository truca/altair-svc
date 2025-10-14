# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `yarn dev` - Start development server with hot reload (runs on port from `PORT` env var, default 4000)
- `yarn start` - Run production server using ts-node
- `yarn build` - Compile TypeScript to JavaScript (outputs to `./dist`)
- `yarn lint` - Run ESLint on TypeScript files
- `yarn lint:fix` - Run ESLint with auto-fix

### Testing Locally with Docker
- `docker build -t altair-svc-local .` - Build Docker image locally
- `docker run -p 4000:4000 altair-svc-local` - Run container locally

## Architecture Overview

This is the **Altair Service**, a GraphQL-based service that automatically generates forms, queries, mutations, and resolvers from GraphQL schema directives. It's designed for building dynamic form-driven applications with built-in authentication and authorization.

### Core Architecture Components

1. **Directive-Driven System**: Uses GraphQL directives to define behavior and automatically generate CRUD operations
2. **Database Abstraction Layer**: Database-agnostic store interface supporting Firestore and PostgreSQL
3. **Dynamic Form Generation**: Automatically creates form schemas from GraphQL type definitions with multi-step layouts
4. **Authentication & Authorization**: JWT-based auth with role-based access control and cookie-based sessions
5. **File Upload Support**: Built-in file handling with validation and static file serving
6. **Server Framework**: GraphQL Yoga with custom HTTP server for health checks and static file serving

### Key Directories

- `src/` - Main application code
  - `main.ts` - Entry point and server setup
  - `schema.ts` - GraphQL schema definition with all types and directives
  - `mapper/` - Entity mappers for data transformation
  - `resolvers/` - Custom resolvers (e.g., calculateRiskAssessments)
  - `mutations/` - Custom mutation implementations
- `lib/` - Core library code (reusable GraphQL directive framework)
  - `ModelDirective/` - Automatic CRUD generation for @model directive
  - `AuthDirective/` - Permission system for @auth directive  
  - `StaticModelDirective/` - Static model handling
  - `stores/` - Database abstraction layer (Firestore, PostgreSQL)
  - `utils/` - Core utilities and form generation
  - `GraphQL/` - GraphQL utilities and types

## How Automatic Generation Works

When you add a `@model` directive to a GraphQL type, the system automatically generates:

1. **Input Types**: Creates `[TypeName]Input` with all fields as optional for queries/mutations
2. **List Types**: Creates `[TypeName]List` with `items` and `maxPages` for pagination
3. **CRUD Mutations**: Generates `create[TypeName]`, `update[TypeName]`, `remove[TypeName]`
4. **Query Operations**: Generates `findOne[TypeName]`, `find[TypeName]List`
5. **Resolvers**: Implements all operations with database store integration
6. **Authorization**: Applies `@auth` rules to filter and validate operations
7. **Form Schema**: Generates complete form with fields, validation, steps, and layout

This happens at schema build time in `lib/ModelDirective/index.ts` using GraphQL schema transformations. The `makeSchema()` function orchestrates the entire process.

## Key Directives System

The service uses GraphQL directives to define behavior:

### @model
Defines a GraphQL type as a database model with automatic CRUD operations.
- Generates: `create`, `update`, `remove`, `findOne`, `findList` operations
- Parameters: `db` (database engine), `table` (collection/table name)

### @auth  
Defines permission rules for CRUD operations.
- Permission types: `"public"`, `"owner"`, `"collaborator"`, `"role:admin"`, etc.
- Applied to operations: `create`, `read`, `update`, `delete`

### @file
Defines file upload fields with validation.
- Parameters: `maxSize`, `types` (allowed MIME types)

### @selectFrom / @selectManyFrom
Defines select fields with options from database or static values.
- Static: `values` array
- Dynamic: `table`, `labelAttribute`, `valueAttribute`, `dependentField`

### Form Layout Directives
- `@position(step, row)` - Multi-step form positioning (step and row numbers for CSS Grid layout)
- `@meta(label, placeholder)` - Form metadata (user-facing labels and placeholders)
- `@hidden(value, cond)` - Conditional visibility (static or condition-based hiding)
- `@default(value)` - Default values (static values or "now" for DateTime)
- `@from(parentAttribute, queryParam)` - Inherit values from parent objects or query params
- `@subform(layout)` - Nested form objects (layout: CARDS or TABS)
- `@polymorphicSubform(types, optionTypes, layout)` - Polymorphic nested forms with type selection
- `@polymorphicArray(types, optionTypes, addButtonText, layout)` - Arrays of polymorphic objects
- `@type(value)` - Override field type (e.g., TEXT, TEXTAREA, NUMBER, DATE, etc.)

## Configuration

### Required Environment Variables

```bash
# Server
PORT=4000
ENVIRONMENT=staging  # or "production"
UPLOAD_PATH=uploads

# JWT Authentication
JWT_SECRET=your-jwt-secret
ACCESS_TOKEN_DURATION_SECONDS=3600  # 1 hour
REFRESH_TOKEN_DURATION_SECONDS=86400  # 1 day

# Database - Firestore
DB_ENGINE=firestore
DB_INTERNAL_NAME=store
FIRESTORE_DB_NAME=your-firestore-db

# Database - PostgreSQL (alternative to Firestore)
DB_ENGINE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your-db
DB_USER=your-user
DB_PASSWORD=your-password

# Optional: Kafka (if using event streaming)
KAFKA_CLIENT_ID=altair-svc
KAFKA_HOST=localhost:9092
KAFKA_GROUP_ID=altair-svc-group
```

### Schema Configuration (src/schema.ts)
Form types are mapped to GraphQL type names for the `form(type: String)` query. Add new types to the `formTypes` object in `makeSchema()` call.

## Domain Context: Educational Wellbeing System

This service implements "Sistema Alumbra" - a comprehensive educational wellbeing and risk assessment platform for schools. Key domain entities include:

- **Organizations** - Schools, districts, universities with configurable settings
- **Profiles** - Students, parents, teachers, administrators with role-based data
- **Surveys & Questions** - Configurable wellbeing assessment surveys with conditions
- **Risk Assessments** - Automated risk calculations based on survey responses
- **Alerts & Interventions** - Automated alert generation and intervention tracking
- **Analytics** - Pre-calculated metrics and reporting

The system processes daily survey responses from students to calculate risk scores across multiple dimensions (wellbeing factors), generates alerts for at-risk students, and provides intervention tracking capabilities.

## Development Patterns

### Adding New Models
1. Define GraphQL type in `src/schema.ts` with appropriate directives (`@model`, `@auth`, etc.)
2. Add entity mapper in `src/mapper/` if custom transformation needed (e.g., for computed fields)
3. Register mapper in `src/mapper/index.ts` in the `entityMapperHash` object
4. The system automatically generates: input types, CRUD operations, resolvers, and form schemas

### Custom Resolvers & Mutations
- Add resolver functions to `src/resolvers/` directory
- Add mutation implementations to `src/mutations/` directory
- Import and register in `src/schema.ts` in the `queries` or `mutations` objects passed to `makeSchema()`
- Resolvers receive `(parent, args, context, info)` - access authenticated user via `context.profile`
- Example: `calculateRiskAssessments` resolver processes survey responses to generate risk scores

### Form Generation
- Forms are automatically generated from GraphQL types using directives
- Query `form(type: String)` returns complete form schema with fields, validation, steps, and CSS Grid layout
- Multi-step forms use `@position(step, row)` to define layout
- Form fields support validation, conditional visibility, dependent selects, and nested subforms

### Authentication & Authorization
- JWT tokens stored in cookies (`accessToken`, `refreshToken`)
- Access user context via `context.profile` in resolvers
- Permission checking happens automatically via `@auth` directive
- Permission types: `"public"`, `"owner"`, `"collaborator"`, `"role:admin"`, `"owner|entity:entityId"`
- Use `getHasPermissionThroughRoles()` for custom permission checks

### Database Abstraction
- All database operations go through the Store interface in `lib/stores/`
- Stores provide: `find()`, `findOne()`, `create()`, `update()`, `remove()`
- Switch databases by changing `DB_ENGINE` environment variable
- Entity mappers handle bidirectional transformation between GraphQL and database formats

## Important Technical Details

### Server Endpoints
- **GraphQL**: `http://localhost:4000/graphql` (or configured PORT)
- **Health Check**: `/health` or `/healthcheck` (returns JSON with status and timestamp)
- **Static Files**: `/uploads/*` (serves uploaded files)
- **CORS**: Enabled for all origins with credentials support

### TypeScript Configuration
- Target: `esnext`, Module: `commonjs`
- Strict mode enabled
- Output directory: `./dist`
- Includes: `src/**/*.ts`, `lib/**/*.ts`

### Package Manager
- Uses **Yarn** (v1.22.22+) as package manager
- Husky configured for git hooks (via `yarn prepare`)

### Key Libraries
- **graphql-yoga**: GraphQL server framework (v5.x)
- **@graphql-tools/schema**: Schema building and transformations
- **@google-cloud/firestore**: Firestore database client
- **pg**: PostgreSQL client
- **jsonwebtoken**: JWT token generation and verification
- **kafkajs**: Kafka event streaming (optional)

### File Structure Notes
- `lib/` - Reusable GraphQL directive framework (can be extracted as separate package)
- `src/schema.ts` - All GraphQL type definitions and schema configuration
- `src/main.ts` - Server entry point with GraphQL Yoga and custom HTTP handling
- `src/mapper/` - Entity mappers for domain-specific data transformations
- `lib/ModelDirective/` - Core logic for automatic CRUD generation
- `lib/AuthDirective/` - Permission system implementation
- `lib/stores/` - Database abstraction layer
- `lib/utils/` - Form generation, JWT utilities, file serving