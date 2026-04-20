# Real Estate CRM & ERP System

A scalable, production-ready backend platform built with **NestJS, MongoDB, Redis, and Cloudinary** that manages the full lifecycle of a real estate business.

---

## Table of Contents

- [Business Overview](#business-overview)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Core Modules](#core-modules)
- [API Reference](#api-reference)
- [Engineering Highlights](#engineering-highlights)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Performance](#performance)
- [Roadmap](#roadmap)

---

## Business Overview

### Problem Statement

Real estate companies face critical operational challenges:

- No unified system for properties, sales, and finance
- Manual tracking of deals and leads
- Lack of real-time business insights
- Poor coordination between sales teams and clients
- No structured financial reporting
- Inefficient scheduling and CRM workflows

### Solution

This platform addresses these problems through:

- Centralized property management
- Full sales pipeline automation
- Integrated CRM for leads and clients
- Financial treasury tracking
- Real-time analytics dashboard
- Automated business rules enforcement
- Scalable modular backend architecture

---

## System Architecture

Modular monolithic architecture built on NestJS:

```
Auth Module
└── Users Module
    ├── Projects Module
    ├── Units Module
    ├── Deals Module
    ├── Leads Module
    ├── Clients Module
    ├── Areas Module
    ├── Treasury Module
    ├── Events Module
    ├── Dashboard Module
    ├── Storage Module (Cloudinary abstraction)
    └── Cache Layer (Redis)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS (TypeScript) + Express |
| Database | MongoDB + Mongoose |
| Cache | Redis |
| Storage | Cloudinary |
| Auth | JWT + RBAC |
| Security | Helmet, Rate Limiting, Joi Validation |
| DevOps | Docker & Docker Compose |

---

## Core Modules

### Projects Module

Manages real estate development projects.

- Create, update, and delete projects
- Multi-image upload support
- Developer assignment
- Unit listing per project
- Project-level analytics

### Units Module

Represents individual real estate properties.

- Unit creation with images
- Status lifecycle: `AVAILABLE` → `RESERVED` → `SOLD`
- Search, filter, and pagination
- Redis caching for performance
- Linked to Projects and Areas

### Deals Module — Sales Pipeline

```
NEW → NEGOTIATION → RESERVATION → CLOSED_WON / CLOSED_LOST
```

- Lead creation and assignment
- Lead tracking system
- Status updates and history
- Conversion analytics

### Leads Module

- Lead capture and management
- Status tracking
- Assignment to sales agents
- Conversion to client on deal close

### Clients Module

- Client profile management
- Email uniqueness validation
- Purchase history tracking
- Financial analytics per client
- Property ownership insights

### Treasury Module — Financial System

- Income and expense tracking
- Deal-linked transactions
- Duplicate transaction prevention
- Excel export via ExcelJS
- Financial statistics and reporting

### Events Module — CRM Scheduling

- User event scheduling
- Conflict detection (overlapping events)
- Date/time validation
- Calendar-ready data structure
- Event assignment system

### Areas Module

- Geographic segmentation of properties
- Unit distribution per area
- Availability percentage analytics
- Cached aggregation results
- Area-based performance insights

### Dashboard Module — Business Intelligence

Key metrics exposed:

- Total properties, available and sold units
- Active deals and total leads
- Revenue tracking
- Sales overview (last 6 months)
- Top sales agents
- Top performing areas
- Recent activity feed

---

## API Reference

Base URL: `/api/v1`

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and receive JWT |

### Projects

| Method | Endpoint | Description |
|---|---|---|
| GET | `/projects` | List all projects |
| POST | `/projects` | Create project |
| GET | `/projects/:id` | Get project by ID |
| PATCH | `/projects/:id` | Update project |
| DELETE | `/projects/:id` | Delete project |
| GET | `/projects/:id/units` | Get units under project |

### Units

| Method | Endpoint | Description |
|---|---|---|
| GET | `/units` | List all units |
| POST | `/units` | Create unit |
| GET | `/units/:id` | Get unit by ID |
| PATCH | `/units/:id` | Update unit |
| DELETE | `/units/:id` | Delete unit |

### Deals

| Method | Endpoint | Description |
|---|---|---|
| GET | `/deals` | List all deals |
| POST | `/deals` | Create deal |
| PATCH | `/deals/:id/status` | Update deal status |
| DELETE | `/deals/:id` | Delete deal |
| GET | `/deals/pipeline-summary` | Get pipeline summary |

### Leads

| Method | Endpoint | Description |
|---|---|---|
| GET | `/leads` | List all leads |
| POST | `/leads` | Create lead |
| PATCH | `/leads/:id` | Update lead |
| PATCH | `/leads/:id/status` | Update lead status |
| DELETE | `/leads/:id` | Delete lead |

### Clients

| Method | Endpoint | Description |
|---|---|---|
| GET | `/clients` | List all clients |
| POST | `/clients` | Create client |
| PATCH | `/clients/:id` | Update client |
| DELETE | `/clients/:id` | Delete client |
| GET | `/clients/:id/analytics` | Get client analytics |

### Treasury

| Method | Endpoint | Description |
|---|---|---|
| GET | `/treasury/transactions` | List transactions |
| POST | `/treasury/transactions` | Create transaction |
| PATCH | `/treasury/transactions/:id` | Update transaction |
| DELETE | `/treasury/transactions` | Delete transaction |
| GET | `/treasury/transactions/export` | Export to Excel |

### Events

| Method | Endpoint | Description |
|---|---|---|
| GET | `/events` | List all events |
| POST | `/events` | Create event |
| PATCH | `/events/:id` | Update event |
| DELETE | `/events` | Delete event |

### Areas

| Method | Endpoint | Description |
|---|---|---|
| GET | `/areas` | List all areas |
| POST | `/areas` | Create area |
| PATCH | `/areas/:id` | Update area |
| DELETE | `/areas/:id` | Delete area |

### Dashboard

| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard` | Get all KPIs and metrics |

---

## Engineering Highlights

### Caching Layer (Redis)

- Units and areas analytics cached in Redis
- Smart cache invalidation on write operations
- Reduces database load on high-frequency reads

### MongoDB Aggregation Engine

Used for:

- Revenue calculations
- Sales pipeline analytics
- Monthly performance reports
- Top agents and areas ranking

### Business Rules Engine

- Prevents selling already-sold units
- Prevents duplicate clients and leads
- Detects event scheduling conflicts
- Prevents duplicate financial transactions
- Enforces deal lifecycle state machine

### Security Layer

- JWT-based authentication
- RBAC with roles: `Admin`, `Super Admin`, `Sales`
- Helmet middleware for HTTP security headers
- Rate limiting at global and module levels
- Input validation via DTOs and Pipes

### Storage System

- Cloudinary integration with provider abstraction
- File validation using real MIME type detection
- Multi-image upload support
- Image replacement and deletion
- Folder-based storage organization

---

## Getting Started

### Prerequisites

Make sure the following are installed on your machine:

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

---

### Option 1 — Run with Docker (Recommended)

This is the easiest way to get the full stack running (API + MongoDB + Redis).

**1. Clone the repository**

```bash
git clone https://github.com/your-org/real-estate-crm.git
cd real-estate-crm
```

**2. Set up environment variables**

```bash
cp .env.example .env
```

Open `.env` and fill in the required values:

```env
# App
PORT=3000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://mongo:27017/real-estate

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**3. Build and start all services**

```bash
docker-compose up --build -d
```

**4. Verify everything is running**

```bash
docker-compose ps
```

All services should show status `Up`.

---

### Option 2 — Run Locally (Without Docker)

Use this if you want to run the API directly on your machine with local or remote MongoDB/Redis instances.

**1. Clone the repository**

```bash
git clone https://github.com/your-org/real-estate-crm.git
cd real-estate-crm
```

**2. Install dependencies**

```bash
npm install
```

**3. Set up environment variables**

```bash
cp .env.example .env
```

Update `.env` to point to your local services:

```env
MONGO_URI=mongodb://localhost:27017/real-estate
REDIS_HOST=localhost
REDIS_PORT=6379
```

**4. Start MongoDB and Redis locally**

If you have Docker available but prefer to run only the infrastructure:

```bash
docker-compose up mongo redis -d
```

Or start them manually if installed natively on your system.

**5. Run the application**

```bash
# Development mode (with hot reload)
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

---

### Verify the API is Running

Once started, the API will be available at:

```
http://localhost:3000/api/v1
```

You can test it with a quick health check or by hitting the login endpoint:

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Admin", "email": "admin@example.com", "password": "123456"}'
```

---

### Common Issues

| Problem | Solution |
|---|---|
| MongoDB connection refused | Make sure the `mongo` container or local MongoDB instance is running |
| Redis connection refused | Make sure the `redis` container or local Redis instance is running |
| Port 3000 already in use | Change `PORT` in `.env` or stop the conflicting process |
| Cloudinary upload fails | Double-check `CLOUDINARY_*` credentials in `.env` |
| JWT errors | Ensure `JWT_SECRET` is set and not empty |

---

## Deployment

```bash
docker-compose up --build -d
```

| Service | URL |
|---|---|
| API | http://localhost:3000 |
| MongoDB | localhost:27017 |
| Redis | localhost:6379 |
| Mongo Express | http://localhost:8081 |

---

## Performance

- Lean queries for all read operations
- Pagination via `ApiFeatures` abstraction
- Redis caching for expensive aggregation queries
- Optimized aggregation pipelines
- Scalable schema design

---

## Roadmap

- Microservices architecture migration
- WebSocket real-time notifications
- Kafka event-driven architecture
- Payment gateway integration
- Advanced BI dashboard
- Multi-tenant SaaS support
