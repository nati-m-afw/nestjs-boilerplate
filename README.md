<p align="center"><img align="center" style="width:320px" src="https://placehold.co/320x320"/></p><br/>
<p align="center"><strong style="font-size: 40px">NestJS API Boilerplate</strong></p><br/>

# Modern NestJS API Boilerplate

A production-ready NestJS API boilerplate with TypeORM, Redis, PostgreSQL, and Docker support. Based on [nestjs-starter-rest-api](https://github.com/monstar-lab-oss/nestjs-starter-rest-api) by Monstar Lab.

## Features

- 🚀 NestJS Framework
- 🔐 JWT Authentication
- 🎯 TypeORM with PostgreSQL
- 📝 Swagger API Documentation
- 🐳 Docker & Docker Compose
- 🔄 Redis as a message queue
- 🔍 E2E Testing Setup
- 🛡️ Role-Based Access Control (RBAC)
- 🔄 Database Migrations & Seeding
- 🌐 NGINX Reverse Proxy

## Prerequisites

- Docker & Docker Compose
- Node.js 16+
- Yarn package manager

## Getting Started

1. Clone the repository
2. Create environment variables file:

```bash
cp .env.example .env
```

3. Configure Redis (required for queue system):
```bash
./queue/prod-conf/init-redis.sh
```

4. Start the development environment:
```bash
make up
```

## Development Commands

### Container Management
```bash
# Start services
make up

# View logs
make logs

# Stop services
make down

# Rebuild services
make build
```

### Database Operations
```bash
# Run migrations
make dc exec app yarn migration:run

# Seed database with initial data
make dc exec app yarn migration:seed

# Generate new migration
make dc exec app yarn migration:generate --name=MigrationName
```

### Code Generation
```bash
# Generate new NestJS module
make api-gen
```

## Project Structure

```
.
├── apps/api/          # NestJS application
│   ├── src/          # Source code
│   ├── test/         # E2E tests
│   └── migrations/   # Database migrations
├── proxy/            # NGINX configuration
├── queue/            # Redis configuration
└── docker-compose.yml
```

## Available Services

- **API**: NestJS application (default: port 5969)
- **PostgreSQL**: Database server
- **Redis**: Caching and queue management
- **NGINX**: Reverse proxy

## Documentation

### API Documentation
API documentation is available at `/docs` endpoint when the server is running.

### Project Documentation
Detailed documentation is available in the `docs/` directory:

- **Architecture Guide**: Comprehensive overview of the module structure, including:
  - Module components and layers
  - Security features
  - Best practices
  - Common design patterns

- **Makefile Guide**: Documentation for all available make commands and environment configurations:
  - Available commands and their usage
  - Environment configuration options
  - Customization guidelines
  - Docker Compose service management

For architecture details, see [docs/architecture.md](docs/architecture.md)
For build and deployment commands, see [docs/makefile.md](docs/makefile.md)

## Testing

```bash
# Run e2e tests
make dc exec app yarn test:e2e
```

For more commands, run:
```bash
make help
```
