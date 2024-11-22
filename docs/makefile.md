# Makefile Documentation

## Overview
The Makefile provides a streamlined interface for managing Docker Compose services in both production and development environments. It automatically detects the environment configuration from `.env` file and applies the appropriate compose files.

## Key Variables
- `DOCKER_COMPOSE`: Base docker-compose command with env file configuration
- `INFRA_DIR`: Production configuration directory path
- `INFRA_DEV_DIR`: Development configuration directory path
- `COMPOSE_FILES`: Production compose file configurations
- `DEV_COMPOSE_FILES`: Development compose file configurations

## Available Commands
- `make up`: Start all services in detached mode
- `make down`: Stop and remove all services
- `make restart`: Restart all services (shorthand for down + up)
- `make logs`: View logs from all services
- `make build`: Rebuild all service containers
- `make dc <command>`: Run arbitrary docker-compose commands
- `make api-gen`: Generate new API module using plop
- `make config`: Display current environment configuration

## Environment Configuration
- Set `CONFIG=dev` in `.env` for development environment
- Set `CONFIG=prod` in `.env` for production environment (default)

## Customization
To modify service configurations:
1. Edit compose files in `infra/prod-conf/` or `infra/dev-conf/`
2. Add new services by creating new compose files and updating `COMPOSE_FILES`/`DEV_COMPOSE_FILES` variables
3. Add new make targets by following the existing pattern and declaring them as .PHONY
