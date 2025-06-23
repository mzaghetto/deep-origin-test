.PHONY: up down logs build clean test-backend backend frontend open init

# Makefile for managing URL Shortener services
# Run from project root directory

up:
	@echo "Starting all services in detached mode..."
	docker-compose up -d

down:
	@echo "Stopping all services..."
	docker-compose down

logs:
	@echo "Showing logs (Ctrl+C to exit)..."
	cd backend && docker-compose logs -f

build:
	@echo "Rebuilding Docker images..."
	docker-compose build

clean:
	@echo "Cleaning up Docker resources..."
	docker-compose down -v
	docker system prune -f

backend:
	@echo "Starting backend service only..."
	cd backend && docker-compose up -d backend

frontend:
	@echo "Starting frontend service only..."
	cd backend && docker-compose up -d frontend

test-backend:
	@echo "Running backend tests..."
	cd backend && docker-compose run -e NODE_ENV=test backend npm test

open:
	@echo "Opening frontend in browser..."
	open http://localhost:30001

init:
	@echo "Initializing project..."
	cd backend && npm install
	cd frontend && npm install
	cd backend && npx prisma migrate dev --name init
