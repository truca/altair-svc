# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

The following commands are available for development:

- `yarn dev` - Start development server with hot reload using ts-node-dev
- `yarn start` - Run production server using ts-node  
- `yarn build` - Compile TypeScript to JavaScript
- `yarn lint` - Run ESLint on TypeScript files
- `yarn lint:fix` - Run ESLint with auto-fix

## Architecture Overview

This is the **Altair Service**, a GraphQL-based service that automatically generates forms, queries, mutations, and resolvers from GraphQL schema directives. It's designed for building dynamic form-driven applications with built-in authentication and authorization.

### Core Architecture Components

1. **Directive-Driven System**: Uses GraphQL directives to define behavior and automatically generate CRUD operations
2. **Database Abstraction Layer**: Database-agnostic store interface supporting Firestore and PostgreSQL
3. **Dynamic Form Generation**: Automatically creates form schemas from GraphQL type definitions
4. **Authentication & Authorization**: JWT-based auth with role-based access control
5. **File Upload Support**: Built-in file handling with validation

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
- `@position(step, row)` - Multi-step form positioning
- `@meta(label, placeholder)` - Form metadata
- `@hidden(value, cond)` - Conditional visibility
- `@default(value)` - Default values
- `@subform(layout)` - Nested form objects
- `@polymorphicSubform(types, layout)` - Polymorphic nested forms

## Database Configuration

The service supports multiple database engines through environment variables:

```bash
# Database
DB_ENGINE=firestore  # or "postgres"
DB_INTERNAL_NAME=store
FIRESTORE_DB_NAME=your-firestore-db

# PostgreSQL (if using postgres)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your-db
DB_USER=your-user
DB_PASSWORD=your-password

# JWT Authentication
JWT_SECRET=your-jwt-secret
ACCESS_TOKEN_DURATION_SECONDS=3600
REFRESH_TOKEN_DURATION_SECONDS=604800
```

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
1. Define GraphQL type in `src/schema.ts` with appropriate directives
2. Add entity mapper in `src/mapper/` if custom transformation needed
3. Register mapper in `src/mapper/index.ts`

### Custom Resolvers
- Add to `src/resolvers/` directory
- Import and register in schema's `mutations` or `queries` object
- Follow existing pattern like `calculateRiskAssessments`

### Form Generation
Forms are automatically generated from GraphQL types using directives. The `form(type: String)` query returns complete form schemas with fields, validation, steps, and layout information.

### Authentication Context
The service provides user context through JWT tokens. Access `context.profile` in resolvers to get current user information and permissions.

## TypeScript Configuration

- Target: `esnext`
- Strict mode enabled
- Output directory: `./dist`
- Includes: `src/**/*.ts`, `lib/**/*.ts`

## File Structure Notes

- The `lib/` directory contains the reusable GraphQL directive framework
- Entity mappers in `src/mapper/` handle domain-specific data transformations
- The service uses Yarn as package manager
- Health check endpoint available at `/health` or `/healthcheck`
- Static file serving available for `/uploads` path