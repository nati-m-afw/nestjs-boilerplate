# Makefile for managing Docker Compose configurations
# Maintainer: Natnael Mekonnen <it.natnael.mekonnen@gmail.com>
# Version: 1.0.0
# Description: This Makefile provides targets for starting, stopping, and managing Docker Compose services
#              with production and development configurations.


# All targets are phony and do not correspond to files
.PHONY: up down restart logs build up-detached dc api-gen help

# Default target
.DEFAULT_GOAL := help

# Variables
DOCKER_COMPOSE = docker compose --env-file .env
INFRA_DIR = ./infra/prod-conf
INFRA_DEV_DIR = ./infra/dev-conf
COMPOSE_FILES = -f ${INFRA_DIR}/db.yml -f ${INFRA_DIR}/redis.yml -f ${INFRA_DIR}/api.yml -f ${INFRA_DIR}/proxy.yml -f ${INFRA_DIR}/certbot.yml
DEV_COMPOSE_FILES = -f ${INFRA_DEV_DIR}/db.yml -f ${INFRA_DEV_DIR}/redis.yml -f ${INFRA_DEV_DIR}/api.yml -f ${INFRA_DEV_DIR}/proxy.yml

# Check if .env file exists and load CONFIG variable
ifneq (,$(wildcard .env))
  CONFIG := $(shell grep ^CONFIG= .env | cut -d '=' -f2)
endif

# Default to production if CONFIG is not set
CONFIG ?= prod

# Use production or development compose files based on CONFIG
ifeq ($(CONFIG), dev)
	COMPOSE_FILES := $(DEV_COMPOSE_FILES)
endif

# Start services
up:
	$(DOCKER_COMPOSE) $(COMPOSE_FILES) up -d

# Stop services
down:
	$(DOCKER_COMPOSE) $(COMPOSE_FILES) down

# Restart services
restart: down up

# Show logs
logs:
	$(DOCKER_COMPOSE) $(COMPOSE_FILES) logs -f

# Rebuild services
build:
	$(DOCKER_COMPOSE) $(COMPOSE_FILES) build

# Allow arbitrary docker-compose commands
dc:
	$(DOCKER_COMPOSE) $(COMPOSE_FILES) $(filter-out $@,$(MAKECMDGOALS))
	@true

# Handle additional arbitrary arguments like `ps` by using the % pattern
%:
	@:

# Generate a module for API service
api-gen:
	${DOCKER_COMPOSE} ${COMPOSE_FILES} exec api yarn plop 

# List currenct CONFIG
config:
	@echo ${CONFIG}

# Help target
help:
	@echo "Available commands:"
	@echo "  make up               : Start services."
	@echo "  make down             : Stop services."
	@echo "  make restart          : Restart services."
	@echo "  make logs             : Show logs."
	@echo "  make build            : Rebuild services."
	@echo "  make dc <args>        : Execute any docker-compose command."
	@echo "  make api-gen          : Generate a module for API service."
	@echo "  make config           : Print current environment configuration."
	@echo "  make help             : Show this help message."

