# Deep Origin - URL Shortener Test

A complete URL shortening service built with NestJS (backend) and Next.js (frontend).

## Project Structure

- `/backend`: NestJS API for URL shortening with:
  - JWT authentication
  - URL management endpoints
  - Visit statistics
  - Swagger API Documentation
- `/frontend`: Next.js application featuring:
  - URL shortening interface
  - User authentication
  - Visit statistics

## Requirements

- Node.js >=18
- PostgreSQL database (or running in Docker Compose)

## Backend Setup

1. Copy `.env.example` to `.env` and configure:
   ```env
    DATABASE_URL=postgresql://postgres:postgres@db:5432/url_shortener
    BASE_URL=http://localhost:40001  
    PORT=40001
    JWT_SECRET=secret-here
    FRONTEND_URL_NOT_FOUND="http://localhost:30001/404"
   ```
2. Install dependencies and start the server:
   ```bash
   cd backend
   npm install
   npx prisma migrate dev --name init
   npm run dev
   ```

## Frontend Setup

1. Copy `.env.local.example` to `.env.local` and set:
   ```env
    NEXT_PUBLIC_API_URL=http://localhost:40001
    API_URL=http://localhost:40001
   ```
2. Start the development server:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Running with Docker

### Using Makefile (from project root)
The Makefile provides shortcuts for common commands:

- Start entire stack (frontend + backend + database):
  ```bash
  make up
  ```
- Stop all services:
  ```bash 
  make down
  ```
- View logs:
  ```bash
  make logs
  ```
- Run backend tests:
  ```bash
  make test-backend
  ```
- Open frontend in browser:
  ```bash
  make open
  ```

### Direct Docker Compose commands (from backend folder):
```bash
cd backend
docker-compose up --build 
```

The backend will be available at `http://localhost:40001` and frontend at `http://localhost:30001`.
> **Note:** When accessing the front-end URL for the first time, wait a bit — the front-end is being compiled in the background. You can check the front-end logs to follow the process.

## Debugging in VSCode

For backend debugging:

1. Open the project in VSCode
2. Go to Run and Debug view (Ctrl+Shift+D)
3. Select "Debug Backend" configuration
4. Set breakpoints in your code
5. Start debugging (F5)

For frontend debugging:

1. Install "Debugger for Chrome" extension
2. Set breakpoints in your frontend code
3. Start development server (`npm run dev`)
4. Launch debug configuration "Debug Frontend"

## API Documentation

Complete API reference available on Postman:
https://documenter.getpostman.com/view/10223767/2sB2xCfoBy

Swagger UI is also available at:
`http://localhost:40001/api` when backend is running

## Usage Example
Example of user login:
![Login example](./docs/login.gif)

Example of user editing slug:
![Slug Edit](./docs/edit-slug.gif)

Visits counter
![Visits counter](./docs/visits-badge.gif)
