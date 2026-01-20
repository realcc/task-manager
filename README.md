# Task Manager

A full-stack task management application built with modern technologies demonstrating TypeScript, React, React Native, Nest.js, GraphQL, and comprehensive testing.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Monorepo | Turborepo + pnpm workspaces |
| Web | Next.js 14 (App Router) + React 18 |
| Mobile | React Native (Expo SDK 54) |
| API | Nest.js + GraphQL (Apollo Server) |
| Database | PostgreSQL + Prisma ORM |
| State | Zustand (client) + Apollo Client (server) |
| Testing | Vitest + React Testing Library + Cypress |
| Auth | JWT with refresh tokens |

## Project Structure

```
task-manager/
├── apps/
│   ├── web/          # Next.js web application
│   ├── mobile/       # React Native (Expo) app
│   └── api/          # Nest.js GraphQL API
├── packages/
│   ├── shared/       # Shared TypeScript types & validators
│   └── config/       # Shared ESLint & TypeScript configs
├── cypress/          # E2E tests
├── docker-compose.yml
└── turbo.json
```

## Prerequisites

- Node.js >= 18
- pnpm >= 9.0
- Docker & Docker Compose

## Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd task-manager
pnpm install
```

### 2. Set Up Environment

```bash
# Copy environment files
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.local.example apps/web/.env.local

# Start PostgreSQL
docker-compose up -d postgres

# Run database migrations and seed
pnpm --filter @task-manager/api db:push
pnpm --filter @task-manager/api db:seed
```

### Demo User

After seeding, you can log in with:
- **Email:** `demo@example.com`
- **Password:** `password123`

### 3. Start Development Servers

```bash
# Start all apps
pnpm dev

# Or start individually
pnpm --filter @task-manager/api dev    # API at http://localhost:4000
pnpm --filter @task-manager/web dev    # Web at http://localhost:3000
pnpm --filter @task-manager/mobile start  # Expo dev server
```

### 4. Running the Mobile App

```bash
# Start Expo dev server
pnpm --filter @task-manager/mobile start

# Or run directly on a platform
pnpm --filter @task-manager/mobile ios      # iOS Simulator
pnpm --filter @task-manager/mobile android  # Android Emulator
pnpm --filter @task-manager/mobile web      # Web browser
```

After starting, press:
- `i` - open iOS Simulator
- `a` - open Android Emulator
- `w` - open in web browser
- `?` - show all commands

**Note:** Ensure the API is running at `http://localhost:4000/graphql` before starting the mobile app.

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all development servers |
| `pnpm build` | Build all applications |
| `pnpm test` | Run all tests |
| `pnpm lint` | Lint all packages |
| `pnpm typecheck` | Type-check all packages |
| `docker-compose up -d postgres` | Start PostgreSQL container |
| `docker-compose down` | Stop PostgreSQL container |
| `pnpm db:reset` | Reset database (destroy & recreate) |
| `pnpm cypress` | Open Cypress test runner |
| `pnpm e2e` | Run E2E tests headless |

## API

The GraphQL API runs at `http://localhost:4000/graphql` with the following features:

- **Authentication**: Register, login, logout with JWT tokens
- **Users**: Profile management, password change
- **Tasks**: Full CRUD with filtering, sorting, pagination
- **Projects**: Project management with task associations

### Example Queries

```graphql
# Get tasks with filtering
query {
  tasks(status: TODO, priority: HIGH, take: 10) {
    items {
      id
      title
      status
      priority
      dueDate
    }
    hasMore
    nextCursor
  }
}

# Create a task
mutation {
  createTask(input: {
    title: "New Task"
    description: "Task description"
    priority: HIGH
  }) {
    id
    title
  }
}
```

## Web Application

The Next.js web app includes:

- **Dashboard**: Task statistics, recent activity, due soon widgets
- **Tasks**: List view with filtering, task detail/edit pages
- **Projects**: Project management view
- **Auth**: Login/register with form validation

## Mobile Application

The Expo app features:

- **Tab Navigation**: Tasks and Profile tabs
- **Task List**: Pull-to-refresh, task cards
- **Task Detail**: View and update task status
- **Profile**: User info and logout

## Screenshots

### Web Application

#### Login

![Login](docs/screenshots/web-login.png)

#### Dashboard

![Dashboard](docs/screenshots/web-dashboard.png)

#### Tasks

![Dashboard](docs/screenshots/web-tasks.png)

#### Projects

![Dashboard](docs/screenshots/web-projects.png)

### Mobile Application

| Login | Task List |                     Profile                     |
|:-----:|:---------:|:-----------------------------------------------:|
| ![Login](docs/screenshots/mobile-login.png) | ![Task List](docs/screenshots/mobile-tasks.png) | ![Profile](docs/screenshots/mobile-profile.png) |

### Cypress E2E Tests

![E2E](docs/screenshots/cypress-e2e-testing.png)

## Testing

### Unit Tests

```bash
# Run all unit tests
pnpm test

# Run API tests
pnpm --filter @task-manager/api test

# Run web tests
pnpm --filter @task-manager/web test
```

### E2E Tests

```bash
# Open Cypress UI
pnpm cypress

# Run headless
pnpm e2e
```

## Environment Variables

### API (.env)

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskmanager
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### Web (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql
```

### Mobile

```env
EXPO_PUBLIC_API_URL=http://localhost:4000/graphql
```

## Database

### Prisma Commands

```bash
# Generate Prisma client
pnpm --filter @task-manager/api db:generate

# Run migrations
pnpm --filter @task-manager/api db:migrate

# Create migration with name
pnpm --filter @task-manager/api exec prisma migrate dev --name <name>

# Reset database
pnpm --filter @task-manager/api exec prisma migrate reset

# Open Prisma Studio
pnpm --filter @task-manager/api db:studio

# Seed database
pnpm --filter @task-manager/api db:seed
```
