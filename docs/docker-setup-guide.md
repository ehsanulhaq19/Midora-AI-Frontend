# Docker Setup Guide

This guide explains how to use the single Dockerfile with three separate Docker Compose configurations for different environments.

## 🏗️ Architecture Overview

The project uses a **single, multi-stage Dockerfile** with **three separate Docker Compose files** for different environments:

- **`Dockerfile`** - Single multi-stage Dockerfile (development + production)
- **`docker-compose.local.yml`** - Local development setup
- **`docker-compose.dev.yml`** - Development environment with optional Redis
- **`docker-compose.live.yml`** - Live production with Redis caching

## 🎯 Frontend-Only Architecture

This application is designed as a **frontend-only application** that communicates with external backend services:

- **Frontend**: Next.js application running in Docker containers
- **Backend**: External service (3rd party API or localhost:8000)
- **Communication**: Both client-side and server-side API calls to backend
- **Caching**: Optional Redis for frontend caching and session management

## 🐳 Single Dockerfile Benefits

### Multi-Stage Builds
- **Base stage**: Common dependencies and setup
- **Development stage**: Full development environment with hot reloading
- **Builder stage**: Application build process
- **Production stage**: Optimized production runtime

### Build Targets
- **Development**: `--target development` (includes dev dependencies, hot reloading)
- **Production**: `--target production` (optimized, minimal runtime)

## 🚀 Quick Start

### Local Development

```bash
# Start local development environment
docker-compose -f docker-compose.local.yml up --build

# Access the application
open http://localhost:3000
```

### Development Environment (with Redis caching)

```bash
# Start development environment with Redis
docker-compose -f docker-compose.dev.yml up --build

# Access the application
open http://localhost:3001
```

### Live Production

```bash
# Start live production environment
docker-compose -f docker-compose.live.yml --env-file .env.live up --build

# Access the application
open http://localhost:3000
```

## 📋 Configuration Files

### 1. Local Development (`docker-compose.local.yml`)

**Purpose**: Local development with hot reloading  
**Port**: 3000  
**Features**: Source code mounting, development dependencies, hot reloading, backend communication

```yaml
services:
  app:
    build:
      target: development          # Uses development stage
      args:
        BUILD_TARGET: development  # Installs all dependencies
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000/api
      - NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
    volumes:
      - .:/app                    # Source code mounting
      - /app/node_modules         # Preserve node_modules
      - /app/.next               # Preserve build cache
    extra_hosts:
      - "host.docker.internal:host-gateway"  # Access host machine
    command: npm run dev          # Development server
```

**Usage**:
```bash
# Start local development
docker-compose -f docker-compose.local.yml up --build

# Stop services
docker-compose -f docker-compose.local.yml down

# View logs
docker-compose -f docker-compose.local.yml logs -f app
```

### 2. Development Environment (`docker-compose.dev.yml`)

**Purpose**: Development with Redis caching  
**Port**: 3001  
**Features**: Development build, Redis caching, backend communication

```yaml
services:
  app:
    build:
      target: development          # Uses development stage
      args:
        BUILD_TARGET: development  # Installs all dependencies
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000/api
      - NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
    # Development settings
  
  redis:
    image: redis:7-alpine         # Redis cache
    # Redis configuration for frontend caching
```

**Usage**:
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up --build

# Stop services
docker-compose -f docker-compose.dev.yml down

# View logs for specific service
docker-compose -f docker-compose.dev.yml logs -f app
```

**Available Services**:
- **app**: Next.js application (port 3001)
- **redis**: Redis cache for frontend (port 6379)

### 3. Live Production (`docker-compose.live.yml`)

**Purpose**: Production with Redis caching  
**Port**: 3000  
**Features**: Production build, Redis caching, backend communication

```yaml
services:
  app:
    build:
      target: production           # Uses production stage
      args:
        BUILD_TARGET: production   # Installs production dependencies only
    environment:
      - NEXT_PUBLIC_API_URL=https://api.yourdomain.com
      - NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com
    # Production optimized settings
  
  redis:
    image: redis:7-alpine         # Redis cache
    # Redis configuration for production caching
```

**Usage**:
```bash
# Start live production
docker-compose -f docker-compose.live.yml --env-file .env.live up --build

# Stop services
docker-compose -f docker-compose.live.yml down

# View logs
docker-compose -f docker-compose.live.yml logs -f app
```

## 🔧 Environment Configuration

### Environment Configuration

1. **Copy the environment template**:
   ```bash
   cp env.example .env.local
   cp env.example .env.dev
   cp env.example .env.live
   ```

2. **Customize each environment file**:

   **`.env.local`** (Local Development):
   ```bash
   NODE_ENV=development
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   CUSTOM_KEY=local_dev_key
   PORT=3000
   ```

   **`.env.dev`** (Development Environment):
   ```bash
   NODE_ENV=development
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   CUSTOM_KEY=dev_key_here
   PORT=3001
   ```

   **`.env.live`** (Live Production):
   ```bash
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com
   NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com
   CUSTOM_KEY=your_production_key_here
   BACKEND_API_URL=https://api.yourdomain.com
   ```

3. **Use with Docker Compose**:
   ```bash
   # Local development
   docker-compose -f docker-compose.local.yml --env-file .env.local up --build
   
   # Development environment
   docker-compose -f docker-compose.dev.yml --env-file .env.dev up --build
   
   # Live production
   docker-compose -f docker-compose.live.yml --env-file .env.live up --build
   ```

## 🗄️ Services and Caching

### Redis Caching

Redis is included for frontend caching purposes:

```yaml
# Redis Cache
redis:
  image: redis:7-alpine
  ports:
    - "6379:6379"
  volumes:
    - redis_data:/data
  networks:
    - midora-network
  restart: unless-stopped
```

**Use Cases**:
- **Session storage** for user authentication
- **API response caching** to reduce backend calls
- **User preferences** and settings
- **Temporary data** storage

### Backend Communication

The frontend communicates with backend services through:

1. **Client-side API calls** using `NEXT_PUBLIC_BACKEND_URL`
2. **Server-side API calls** using `BACKEND_API_URL`
3. **API utility functions** in `src/lib/backend-api.ts`

## 📊 Build Process

### Development Build

```bash
# Build development image
docker build --target development -t midora-dev .

# Or via Docker Compose
docker-compose -f docker-compose.local.yml build
docker-compose -f docker-compose.dev.yml build
```

**What happens**:
1. Installs all dependencies (including dev dependencies)
2. Copies source code
3. Sets up development environment
4. Enables hot reloading

### Production Build

```bash
# Build production image
docker build --target production -t midora-prod .

# Or via Docker Compose
docker-compose -f docker-compose.live.yml build
```

**What happens**:
1. Installs production dependencies only
2. Builds the Next.js application
3. Creates optimized production runtime
4. Sets up production environment

## 🔄 Development Workflow

### 1. Local Development

```bash
# Start local development
docker-compose -f docker-compose.local.yml up --build

# Make code changes (hot reloading enabled)
# View changes at http://localhost:3000

# View logs
docker-compose -f docker-compose.local.yml logs -f app

# Stop development
docker-compose -f docker-compose.local.yml down
```

### 2. Development with Redis

```bash
# Start development with Redis caching
docker-compose -f docker-compose.dev.yml up --build

# Make code changes (hot reloading enabled)
# View changes at http://localhost:3001

# Access Redis at localhost:6379

# Stop development
docker-compose -f docker-compose.dev.yml down
```

### 3. Deploy to Live

```bash
# Deploy to live environment
docker-compose -f docker-compose.live.yml --env-file .env.live up --build -d

# Check deployment status
docker-compose -f docker-compose.live.yml ps

# View live logs
docker-compose -f docker-compose.live.yml logs -f app
```

## 🧪 Testing and Quality

### Running Tests

```bash
# Run tests in local development container
docker-compose -f docker-compose.local.yml exec app npm test

# Run tests in development container
docker-compose -f docker-compose.dev.yml exec app npm test

# Run tests with coverage
docker-compose -f docker-compose.local.yml exec app npm run test:coverage

# Run linting
docker-compose -f docker-compose.local.yml exec app npm run lint
```

### Type Checking

```bash
# Run TypeScript type checking
docker-compose -f docker-compose.local.yml exec app npm run type-check
```

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose -f docker-compose.local.yml build --no-cache
```

#### Port Conflicts
```bash
# Check port usage
sudo lsof -i :3000
sudo lsof -i :3001

# Use different port in compose file
ports:
  - "3002:3000"
```

#### Backend Connection Issues
```bash
# Check if backend is accessible
curl http://localhost:8000/health

# Verify environment variables
docker-compose -f docker-compose.local.yml exec app env | grep BACKEND
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
docker-compose -f docker-compose.local.yml logs app

# Check container status
docker-compose -f docker-compose.local.yml ps

# Rebuild container
docker-compose -f docker-compose.local.yml build --no-cache app
```

### Debug Mode

```bash
# Enable debug logging
DEBUG=* docker-compose -f docker-compose.local.yml up

# Run container in interactive mode
docker-compose -f docker-compose.local.yml run --rm app /bin/sh

# Inspect container
docker-compose -f docker-compose.local.yml exec app /bin/sh
```

## 📈 Performance Optimization

### Development Optimizations

- **Hot reloading** for instant feedback
- **Volume mounting** for source code changes
- **Development dependencies** for debugging tools

### Production Optimizations

- **Multi-stage builds** for smaller images
- **Production dependencies only** for security
- **Redis caching** for improved performance
- **Optimized Next.js build** for faster loading

## 🔒 Security Features

### Development Security

- **Source code isolation** in containers
- **Development-only dependencies**
- **Local network isolation**

### Production Security

- **Non-root user** execution
- **Environment variable** configuration
- **Input validation** and sanitization
- **Secure communication** with backend services

## 📚 Best Practices

### 1. Environment Management
- Use separate environment files for different environments
- Never commit `.env` files to version control
- Use environment variables for sensitive data

### 2. Build Optimization
- Use multi-stage builds for smaller images
- Leverage Docker layer caching
- Optimize dependency installation order

### 3. Development Workflow
- Use hot reloading for faster development
- Test production builds locally before deployment
- Implement proper health checks

### 4. Production Deployment
- Use health checks for monitoring
- Implement proper logging and monitoring
- Set up backup and recovery procedures

### 5. Backend Communication
- Use environment variables for backend URLs
- Implement proper error handling and retries
- Use timeouts to prevent hanging requests

## 🔧 Customization

### Adding New Services

1. **Add service to appropriate compose file**
2. **Configure environment variables**
3. **Set up volumes and networks**
4. **Update documentation**

### Modifying Build Process

1. **Update Dockerfile stages**
2. **Test builds locally**
3. **Update environment variables if needed**
4. **Document changes**

---

**Last Updated**: December 2024  
**Version**: 0.1.0  
**Maintainer**: Midora AI Team
