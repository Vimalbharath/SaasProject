# Sports SaaS Platform

Multi-tenant sports tournament management and scoreboard platform built with Spring Boot (Backend) and React + TanStack Query (Frontend).

## Project Structure

- `backend/` - Spring Boot multi-tenant backend application.
- `frontend/` - React frontend application.
- `libs/api-client/` - Generated TypeScript API client using Orval.

## Getting Started

### Backend
1. Navigate to `backend/`.
2. Configure your MySQL database connection in `src/main/resources/application.properties`.
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend
1. Navigate to `frontend/`.
2. Install dependencies and start the development server:
   ```bash
   pnpm install
   pnpm dev
   ```
