# Docker Compose Configuration Guide

This guide explains how to use the different Docker Compose configurations for various environments.

## 🏗️ Configuration Files Overview

The project includes multiple Docker Compose configurations:

- **`docker-compose.yml`** - Production configuration (base)
- **`docker-compose.override.yml`** - Development override (auto-loaded)
- **`docker-compose.dev.yml`** - Development environment with additional services
- **`docker-compose.local.yml`** - Local development (minimal setup)

## 🚀 Quick Start

### Default Development (Recommended for most developers)

```bash
# This automatically uses docker-compose.yml + docker-compose.override.yml
docker-compose up --build

# Access the application
open http://localhost:3000
```

### Production Mode

```bash
# Use only the production configuration
docker-compose -f docker-compose.yml up --build

# Or with environment file
docker-compose -f docker-compose.yml --env-file .env.production up --build
```

### Development Environment (with additional services)

```bash
# Use development configuration with database, Redis, etc.
docker-compose -f docker-compose.dev.yml up --build

# Access the application
open http://localhost:3001
```

### Local Development (minimal)

```bash
# Use local configuration (minimal services)
docker-compose -f docker-compose.local.yml up --build

# Access the application
open http://localhost:3000
```

## 📋 Environment Configurations

### 1. Default Development (`docker-compose.yml` + `docker-compose.override.yml`)

**Port**: 3000  
**Features**: Hot reloading, source code mounting, development dependencies

```bash
# Start development
docker-compose up --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f app
```

**Configuration**:
- Source code mounted for hot reloading
- Development dependencies installed
- Health checks enabled
- Development environment variables

### 2. Production (`docker-compose.yml`)

**Port**: 3000  
**Features**: Production build, optimized performance, production dependencies only

```bash
# Start production
docker-compose -f docker-compose.yml up --build

# Stop services
docker-compose -f docker-compose.yml down

# View logs
docker-compose -f docker-compose.yml logs -f app
```

**Configuration**:
- Production build with `npm run build`
- Production dependencies only
- Volume mounts for logs and uploads
- Production environment variables

### 3. Development Environment (`docker-compose.dev.yml`)

**Port**: 3001  
**Features**: Full development stack with database, Redis, and additional services

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up --build

# Stop services
docker-compose -f docker-compose.dev.yml down

# View logs for specific service
docker-compose -f docker-compose.dev.yml logs -f app-dev
```

**Available Services**:
- **app-dev**: Next.js application (port 3001)
- **db-dev**: PostgreSQL database (port 5432) - commented out
- **redis-dev**: Redis cache (port 6379) - commented out
- **mailhog-dev**: Email testing (ports 1025, 8025) - commented out

### 4. Local Development (`docker-compose.local.yml`)

**Port**: 3000  
**Features**: Minimal setup for local development

```bash
# Start local development
docker-compose -f docker-compose.local.yml up --build

# Stop services
docker-compose -f docker-compose.local.yml down
```

**Configuration**:
- Minimal services
- Development mode
- Source code mounting
- Health checks

## 🔧 Environment Variables

### Setting Environment Variables

1. **Copy the template**:
   ```bash
   cp docker-compose.env .env
   ```

2. **Edit the `.env` file** with your configuration

3. **Use with Docker Compose**:
   ```bash
   docker-compose --env-file .env up
   ```

### Environment Variable Reference

```bash
# Application
NODE_ENV=development                    # Environment mode
NEXT_TELEMETRY_DISABLED=1              # Disable Next.js telemetry
CUSTOM_KEY=your_key_here               # Custom application key

# API
NEXT_PUBLIC_API_URL=http://localhost:3000/api  # API base URL

# Database (if using database services)
POSTGRES_DB=midora_dev                 # Database name
POSTGRES_USER=midora_user              # Database user
POSTGRES_PASSWORD=dev_password         # Database password

# Redis (if using Redis service)
REDIS_HOST=redis                       # Redis host
REDIS_PORT=6379                        # Redis port
```

## 🗄️ Database and Additional Services

### Enabling Database Service

1. **Uncomment in docker-compose.dev.yml**:
   ```yaml
   db-dev:
     image: postgres:15-alpine
     environment:
       POSTGRES_DB: midora_dev
       POSTGRES_USER: midora_user
       POSTGRES_PASSWORD: dev_password
     ports:
       - "5432:5432"
     volumes:
       - postgres_dev_data:/var/lib/postgresql/data
   ```

2. **Uncomment volumes section**:
   ```yaml
   volumes:
     postgres_dev_data:
   ```

3. **Start with database**:
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

### Enabling Redis Service

1. **Uncomment in docker-compose.dev.yml**:
   ```yaml
   redis-dev:
     image: redis:7-alpine
     ports:
       - "6379:6379"
     volumes:
       - redis_dev_data:/data
   ```

2. **Uncomment volumes section**:
   ```yaml
   volumes:
     redis_dev_data:
   ```

### Enabling Mailhog (Email Testing)

1. **Uncomment in docker-compose.dev.yml**:
   ```yaml
   mailhog-dev:
     image: mailhog/mailhog:latest
     ports:
       - "1025:1025"
       - "8025:8025"
   ```

2. **Access Mailhog UI**:
   Open http://localhost:8025

## 📊 Service Management

### Viewing Services

```bash
# List running services
docker-compose ps

# List all services (including stopped)
docker-compose ps -a

# View service status
docker-compose -f docker-compose.dev.yml ps
```

### Managing Services

```bash
# Start specific service
docker-compose up app

# Stop specific service
docker-compose stop app

# Restart specific service
docker-compose restart app

# Remove specific service
docker-compose rm app
```

### Logs and Debugging

```bash
# View all logs
docker-compose logs

# Follow logs for specific service
docker-compose logs -f app

# View logs with timestamps
docker-compose logs -t app

# View logs for specific time range
docker-compose logs --since="2024-12-01T10:00:00" app
```

### Health Checks

```bash
# Check service health
docker-compose ps

# Manual health check
curl http://localhost:3000/api/health

# View health check logs
docker-compose events
```

## 🔄 Development Workflow

### 1. Start Development Environment

```bash
# Clone repository
git clone <repository-url>
cd midora.ai-frontend

# Start development (default)
docker-compose up --build

# Or use specific configuration
docker-compose -f docker-compose.dev.yml up --build
```

### 2. Development Workflow

```bash
# Make code changes (hot reloading enabled)
# View changes at http://localhost:3000

# View logs
docker-compose logs -f app

# Restart if needed
docker-compose restart app
```

### 3. Testing

```bash
# Run tests in container
docker-compose exec app npm test

# Run tests with coverage
docker-compose exec app npm run test:coverage

# Run linting
docker-compose exec app npm run lint
```

### 4. Building for Production

```bash
# Build production image
docker-compose -f docker-compose.yml build

# Test production build
docker-compose -f docker-compose.yml up
```

## 🚨 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Check what's using the port
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>

# Or use different port
docker-compose -f docker-compose.dev.yml up --build
```

#### Permission Issues
```bash
# Fix file permissions
sudo chown -R $USER:$USER .

# Fix Docker permissions
sudo usermod -aG docker $USER
# Log out and back in
```

#### Container Won't Start
```bash
# Check container logs
docker-compose logs app

# Check container status
docker-compose ps

# Rebuild container
docker-compose build --no-cache app
```

#### Health Check Failures
```bash
# Check if curl is available in container
docker-compose exec app which curl

# Install curl if missing
docker-compose exec app apk add --no-cache curl

# Test health endpoint manually
docker-compose exec app wget -qO- http://localhost:3000/api/health
```

### Debug Mode

```bash
# Enable debug logging
DEBUG=* docker-compose up

# Run container in interactive mode
docker-compose run --rm app /bin/sh

# Inspect container
docker-compose exec app /bin/sh
```

## 📚 Best Practices

### 1. Environment Separation
- Use different compose files for different environments
- Never commit `.env` files to version control
- Use `.env.example` as a template

### 2. Service Management
- Use health checks for critical services
- Implement proper restart policies
- Monitor resource usage

### 3. Development Workflow
- Use volume mounts for source code in development
- Implement hot reloading for faster development
- Use separate ports for different environments

### 4. Security
- Don't expose database ports in production
- Use environment variables for sensitive data
- Implement proper network isolation

## 🔧 Customization

### Adding New Services

1. **Add service to appropriate compose file**
2. **Configure environment variables**
3. **Set up volumes and networks**
4. **Update documentation**

### Modifying Existing Services

1. **Update service configuration**
2. **Test changes locally**
3. **Update environment variables if needed**
4. **Document changes**

---

**Last Updated**: December 2024  
**Version**: 0.1.0  
**Maintainer**: Midora AI Team
