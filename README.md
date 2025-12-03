# Express Core API 🚀

A production-ready REST API built with Node.js, Express, PostgreSQL, and Redis.
This project follows a modular, feature-based architecture and includes authentication, caching, logging, and containerization.

## 🛠 Tech Stack

- **Core:** Node.js, Express.js
- **Database:** PostgreSQL (via Prisma ORM)
- **Caching:** Redis
- **Authentication:** JWT (Access & Refresh Tokens)
- **Validation:** Joi
- **Logging:** Winston
- **Documentation:** Swagger (OpenAPI 3.0)
- **Testing:** Jest, Supertest
- **Infrastructure:** Docker, Docker Compose

---

## ⚡️ Quick Start (Docker)

The easiest way to run the application is using Docker. It sets up the API, Database, and Redis automatically.

### 1. Prerequisites

- Docker & Docker Compose installed.

### 2. Run the application

```bash
docker-compose up --build
```

### 3\. Run Database Migrations

Once the containers are running (and the database is ready), open a **new terminal** window and apply migrations:

```bash
docker-compose exec api npx prisma migrate deploy
```

The server will be available at: `http://localhost:3000`

---

## 🏃‍♂️ Running Locally (Without Docker)

If you prefer to run Node.js locally on your machine.

### 1\. Prerequisites

- Node.js (v18+)
- PostgreSQL (running locally or via Brew)
- Redis (running locally or via Brew)

### 2\. Installation

```bash
npm install
```

### 3\. Configuration

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development

# Database (Change credentials if needed)
DATABASE_URL="postgresql://user:password@localhost:5432/express_db?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# Security Secrets (Change these for production!)
JWT_ACCESS_SECRET="super_secret_access_key"
JWT_REFRESH_SECRET="super_secret_refresh_key"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
```

### 4\. Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Create tables in your local Postgres
npx prisma migrate dev --name init
```

### 5\. Start Server

```bash
npm start
# OR for development with nodemon (if installed)
# npm run dev
```

---

## 🧪 Testing

The project includes Unit Tests (for Services) and Integration Tests (for API Endpoints).

To run all tests:

```bash
npm test
```

---

## 📚 API Documentation (Swagger)

Once the server is running, you can access the interactive API documentation at:

👉 **http://localhost:3000/api-docs**

### Key Endpoints:

- **System:**
  - `GET /health` - Check server status & uptime.
  - `GET /ping` - Simple connectivity test.
- **Auth:**
  - `POST /auth/register` - Create a new account (Roles: Jedi, Sith, Senator).
  - `POST /auth/login` - Get Access & Refresh tokens.
  - `POST /auth/refresh` - Refresh an expired access token.
- **Users:**
  - `GET /users` - Get list of users (Protected, Requires Role).
  - `GET /users/:id` - Get user details (Protected, Cached in Redis).

---

## 📂 Project Structure

```
src/
├── config/         # Configuration files (env, swagger, etc.)
├── docs/           # OpenAPI/Swagger YAML definitions
├── middlewares/    # Global middlewares (Auth, Error, Logger, etc.)
├── modules/        # Feature-based modules
│   ├── auth/       # Auth feature (Controller, Service, Routes)
│   ├── users/      # Users feature (Repository, Service, Controller, Routes)
│   └── health/     # System health checks
├── utils/          # Utility classes (Logger, Prisma Client, Redis Client)
├── app.js          # App assembly and middleware setup
└── server.js       # Entry point (Server startup)
```

---

## 🛡 Security Features implemented

- **Helmet:** Sets secure HTTP headers.
- **CORS:** configuration for cross-origin requests.
- **Rate Limiting:** (Prepared for implementation).
- **Request ID:** Tracing for every incoming request.
- **Password Hashing:** Using `bcrypt`.

<!-- end list -->

```

```
