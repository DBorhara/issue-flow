# IssueFlow

**Live Demo:** `https://issue-flow-ten.vercel.app/`

**API Health:** `https://issue-flow-api.onrender.com/api/health`

IssueFlow is a full-stack issue tracking application built with React, TypeScript, Express, and PostgreSQL. It provides a responsive workflow for creating, updating, searching, filtering, sorting, and deleting issues through a REST API backed by persistent PostgreSQL storage.

## Preview

![IssueFlow Dashboard](docs/issueflow-dashboard.png)

## Features

- Create issues with configurable priority levels
- Update issue titles, priorities, and workflow status
- Delete issues
- Search issues by title
- Filter issues by status
- Sort issues by newest, oldest, title, or priority
- View dashboard summaries for total, todo, in-progress, and completed issues
- Persistent PostgreSQL data storage
- RESTful Express API
- Server-side request validation
- Automated unit and API integration tests
- Dedicated PostgreSQL test database
- Dockerized PostgreSQL development environment

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- CSS

### Backend

- Node.js
- Express
- TypeScript
- PostgreSQL

### Testing

- Vitest
- Supertest
- V8 coverage

### Development

- Docker
- Docker Compose
- Git
- npm

### Deployment

- Vercel
- Render
- Neon PostgreSQL

## Architecture

```text
Browser
   │
   ▼
Vercel
React + TypeScript
   │
   │ HTTPS / JSON
   ▼
Render
Express REST API
   │
   ▼
Route Layer
   │
   ▼
Repository Layer
   │
   ▼
Neon
PostgreSQL
```

The backend uses a layered architecture that separates HTTP handling from database access.

```text
server/src/
├── app.ts
├── db.ts
├── index.ts
├── types.ts
├── validators.ts
├── repositories/
│   └── issues.ts
└── routes/
    ├── health.ts
    └── issues.ts
```

The route layer handles HTTP requests, validation, status codes, and responses.

The repository layer handles PostgreSQL queries and database operations.

This separation keeps database logic independent from Express-specific request handling and makes the application easier to maintain and test.

## API

### Get All Issues

```http
GET /api/issues
```

Returns all issues ordered from newest to oldest.

### Create an Issue

```http
POST /api/issues
```

Example request:

```json
{
  "title": "Fix login bug",
  "priority": "High"
}
```

New issues receive a default status of:

```text
Todo
```

### Update an Issue

```http
PATCH /api/issues/:id
```

The API supports partial updates.

Update status:

```json
{
  "status": "Done"
}
```

Update title and priority:

```json
{
  "title": "Fix authentication bug",
  "priority": "Medium"
}
```

### Delete an Issue

```http
DELETE /api/issues/:id
```

Successfully deleted issues return:

```text
204 No Content
```

### Health Check

```http
GET /api/health
```

The health endpoint verifies that the Express application can successfully communicate with PostgreSQL.

Example response:

```json
{
  "status": "ok",
  "databaseTime": "..."
}
```

## Database

Issues are stored in PostgreSQL with the following fields:

```text
id
title
status
priority
created_at
updated_at
```

Issue IDs are generated automatically by PostgreSQL.

Valid statuses are:

```text
Todo
In Progress
Done
```

Valid priorities are:

```text
Low
Medium
High
```

Database constraints enforce valid status and priority values.

SQL queries use parameterized values rather than directly interpolating user input into query strings.

Example:

```sql
INSERT INTO issues (
  title,
  priority
)
VALUES ($1, $2);
```

## Testing

IssueFlow includes both unit tests and API integration tests.

### Unit Tests

Validation utilities are tested independently using Vitest.

Tests verify behavior such as:

- Accepting valid issue statuses
- Rejecting invalid issue statuses
- Accepting valid priorities
- Rejecting invalid priorities
- Rejecting unexpected value types

### API Integration Tests

Supertest sends HTTP requests directly to the Express application.

Integration tests exercise the application across the full backend stack:

```text
HTTP Request
    │
    ▼
Express
    │
    ▼
Route
    │
    ▼
Repository
    │
    ▼
PostgreSQL Test Database
```

The integration suite covers:

- Creating issues
- Retrieving issues
- Updating issues
- Deleting issues
- Invalid titles
- Invalid priorities
- Invalid statuses
- Invalid issue IDs
- Missing issues
- Database health checks

Tests use a dedicated:

```text
issueflow_test
```

PostgreSQL database so automated tests do not modify development data.

Before each integration test, the issue table is reset to provide a predictable testing environment.

### Run Tests

From the `server` directory:

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Coverage

```bash
npm run coverage
```

### Run TypeScript Checking

```bash
npm run typecheck
```

## Local Development

### Prerequisites

Install:

- Node.js
- npm
- Docker
- Docker Compose

### Clone the Repository

```bash
git clone https://github.com/DBorhara/issue-flow
cd issue-flow
```

### Install Frontend Dependencies

From the project root:

```bash
npm install
```

### Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

## Environment Variables

### Backend

Create:

```text
server/.env
```

using:

```text
server/.env.example
```

as a template.

Example local configuration:

```env
POSTGRES_DB=issueflow
POSTGRES_USER=issueflow
POSTGRES_PASSWORD=your_password

PGHOST=localhost
PGPORT=5432
PGDATABASE=issueflow
PGUSER=issueflow
PGPASSWORD=your_password
```

A hosted environment can instead provide:

```env
DATABASE_URL=postgresql://user:password@host/database
```

The production frontend origin can be configured with:

```env
FRONTEND_ORIGIN=https://your-app.vercel.app
```

Do not commit `.env` files containing credentials.

### Frontend

The production API URL is configured using:

```env
VITE_API_URL=https://your-api.onrender.com
```

During local development, the application can use the Vite `/api` proxy instead.

## Start PostgreSQL Locally

From the project root:

```bash
docker compose up -d
```

This starts the local PostgreSQL container used by the development environment.

## Start the Backend

```bash
cd server
npm run dev
```

The API runs locally at:

```text
http://localhost:3001
```

## Start the Frontend

In another terminal, from the project root:

```bash
npm run dev
```

Open the local URL displayed by Vite.

## Production Build

### Frontend

From the project root:

```bash
npm run build
```

### Backend

```bash
cd server
npm run build
npm start
```

## Deployment

IssueFlow is designed to use separate services for each application layer:

```text
Frontend
Vercel

Backend API
Render

Database
Neon PostgreSQL
```

The frontend communicates with the Express API over HTTPS.

The Express application connects to the hosted PostgreSQL database using a production `DATABASE_URL`.

CORS configuration restricts browser access to the configured frontend origin.

## Future Improvements

Potential future additions include:

- User authentication
- Multiple projects and workspaces
- Issue assignment
- Comments and discussions
- Due dates
- Activity history
- User accounts and permissions
- GitHub Actions continuous integration
- Additional frontend automated testing

## What I Learned

Building IssueFlow provided hands-on experience with:

- Component-based React development
- TypeScript across frontend and backend applications
- React state management and controlled forms
- Asynchronous API communication
- REST API design
- Express routing and middleware
- Server-side request validation
- PostgreSQL schema design
- Parameterized SQL queries
- Repository-based backend architecture
- Separation of concerns
- Docker and Docker Compose
- Unit testing with Vitest
- API integration testing with Supertest
- Dedicated test database management
- Test coverage reporting
- Cloud application deployment
- Environment-based application configuration
- Git-based development workflows
