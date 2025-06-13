# Retail Media Service

A GraphQL-based retail media management service built with TypeScript, GraphQL Yoga, and Google Cloud Firestore.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Development](#development)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Authentication & Authorization](#authentication--authorization)
- [File Upload](#file-upload)
- [Testing](#testing)
- [Contributing](#contributing)

## Overview

This service provides a GraphQL API for managing retail media campaigns, brands, products, and related entities. It features robust authentication, authorization, file handling, and efficient database operations using Google Cloud Firestore.

## Features

- **GraphQL API** with full CRUD operations
- **Authentication & Authorization** with JWT tokens and role-based access control
- **File Upload** support with multipart forms
- **Google Cloud Firestore** integration
- **Relationship Management** between entities (parent-child, many-to-many)
- **Pagination** with configurable page sizes
- **Efficient Querying** with selective field fetching
- **Multi-value Filtering** support
- **Soft Delete** functionality
- **Docker** containerization ready

## Tech Stack

- **Runtime**: Node.js 20.18.1
- **Language**: TypeScript 5.1.6
- **GraphQL**: GraphQL Yoga 5.3.0
- **Database**: Google Cloud Firestore
- **Authentication**: JWT (jsonwebtoken)
- **File Processing**: Multipart form handling
- **Container**: Docker
- **CI/CD**: GitLab CI with Google Cloud Run

## Prerequisites

Before running this application, ensure you have:

- Node.js 20.18.1 or higher
- npm or yarn package manager
- Google Cloud SDK (gcloud CLI)
- Docker (for containerization)
- Google Cloud Project with Firestore enabled
- Service account credentials for Google Cloud

## Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd retail-media-service
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# JWT Configuration
JWT_SECRET=your_jwt_secret_key
ACCESS_TOKEN_DURATION_SECONDS=3600
REFRESH_TOKEN_DURATION_SECONDS=86400

# Server Configuration
PORT=4000
ENVIRONMENT=development
UPLOAD_PATH=uploads

# Database Configuration
DB_ENGINE=firestore
DB_INTERNAL_NAME=store
FIRESTORE_DB_NAME=your-firestore-database-name

# Google Cloud Configuration (handled via gcloud auth)
# No need to set GOOGLE_APPLICATION_CREDENTIALS if using gcloud auth
```

### Required Environment Variables

| Variable            | Description                      | Default   |
| ------------------- | -------------------------------- | --------- |
| `JWT_SECRET`        | Secret key for JWT token signing | -         |
| `PORT`              | Server port                      | 4000      |
| `DB_ENGINE`         | Database engine (firestore)      | firestore |
| `FIRESTORE_DB_NAME` | Firestore database name          | -         |

## Database Setup

This application uses **Google Cloud Firestore** as the primary database.

### 1. Set up Google Cloud Project

```bash
# Install Google Cloud SDK
# https://cloud.google.com/sdk/docs/install

# Authenticate with Google Cloud
gcloud auth login

# Set your project
gcloud config set project YOUR_PROJECT_ID

# Enable Firestore API
gcloud services enable firestore.googleapis.com
```

### 2. Create Firestore Database

```bash
# Create a Firestore database (if not already created)
gcloud firestore databases create --region=us-central1
```

### 3. Set up Authentication

The application uses Google Cloud's Application Default Credentials (ADC):

```bash
# Set up application default credentials
gcloud auth application-default login
```

### 4. Connect to Firestore via Terminal

To connect and manage your Firestore database from the terminal:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# List your projects
firebase projects:list

# Use a specific project
firebase use YOUR_PROJECT_ID

# Access Firestore console
firebase firestore
```

### Database Collections

The service manages the following main collections:

- `Service` - Service definitions
- `Brand` - Brand information
- `CampaignGroup` - Campaign group data
- `Category` - Product categories
- `ProductManager` - Product manager details
- `Profile` - User profiles
- `Seller` - Seller information
- `Subcategory` - Product subcategories

## Development

### Running Locally

1. **Development mode with auto-reload**:

   ```bash
   npm run dev
   ```

2. **Production mode**:

   ```bash
   npm run build
   npm start
   ```

3. **Linting**:
   ```bash
   npm run lint
   npm run lint:fix
   ```

### GraphQL Playground

Once the server is running, access the GraphQL playground at:

```
http://localhost:4000/graphql
```

## Deployment

### Docker Deployment

1. **Build Docker image**:

   ```bash
   docker build -t retail-media-service .
   ```

2. **Run container**:
   ```bash
   docker run -p 4000:4000 --env-file .env retail-media-service
   ```

### Google Cloud Run

The project includes GitLab CI/CD configuration for automatic deployment to Google Cloud Run. The deployment process:

1. Builds Docker image
2. Pushes to Google Container Registry
3. Deploys to Cloud Run

## API Documentation

### GraphQL Schema

The API follows GraphQL best practices with:

- **Queries** for data fetching
- **Mutations** for data modifications
- **Custom directives** for authentication and model definitions
- **File upload** support via multipart forms

### Authentication

All requests require authentication via JWT tokens passed in cookies:

- `accessToken` - Short-lived token (1 hour)
- `refreshToken` - Long-lived token (24 hours)

### Example Queries

```graphql
# Get all brands
query GetBrands {
  brands {
    id
    name
    description
  }
}

# Create a campaign group
mutation CreateCampaignGroup($data: CampaignGroupInput!) {
  createCampaignGroup(data: $data) {
    id
    name
    brand {
      id
      name
    }
  }
}
```

## Authentication & Authorization

### Token System

The service uses a dual-token authentication system:

- **Access Token**: Contains user information, expires in 1 hour
- **Refresh Token**: Used to refresh access tokens, expires in 24 hours

### Authorization Levels

1. **Static Authorization**: Based on user roles
2. **Entity-based Authorization**: Based on ownership and collaboration

### Role-based Access Control

- Users can only access entities they own or collaborate on
- Admin users have broader access permissions
- Guest users have read-only access to public entities

## File Upload

### Supported Operations

The service supports file uploads through GraphQL mutations:

```bash
# Upload file example
curl -X POST \
  -F 'operations={"query":"mutation ($file: File!) { saveFile(file: $file) }", "variables": { "file": null }}' \
  -F 'map={"0": ["variables.file"]}' \
  -F '0=@image.png' \
  http://localhost:4000/graphql
```

### File Storage

- Files are stored in the configured `UPLOAD_PATH` directory
- File metadata is stored in Firestore
- Supports common image and document formats

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Database Testing

For testing with Firestore:

1. Use Firestore emulator for local testing
2. Set up test-specific collections
3. Clean up test data after each test run

## API Features

### Pagination

```graphql
query GetBrands($page: Int, $pageSize: Int) {
  brands(page: $page, pageSize: $pageSize) {
    id
    name
  }
}
```

- Set `pageSize: -1` to get all elements
- Default pagination: 10 items per page

### Multi-value Filtering

```graphql
query GetProductsByCategories {
  products(where: { category: ["electronics,clothing"] }) {
    id
    name
    category
  }
}
```

### Relationship Management

- Create objects with their children in a single mutation
- Efficiently fetch related objects
- Support for bidirectional relationships

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Use semantic commit messages
- Update documentation as needed

## License

This project is licensed under the ISC License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
