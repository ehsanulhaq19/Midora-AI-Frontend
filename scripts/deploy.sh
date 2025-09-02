#!/bin/bash

# Deployment script for Midora AI Frontend
# This script deploys the application using Docker

set -e

echo "🚀 Starting deployment process for Midora AI Frontend..."

# Configuration
APP_NAME="midora-ai-frontend"
DOCKER_IMAGE_NAME="midora-ai-frontend"
DOCKER_TAG="latest"
CONTAINER_NAME="midora-ai-frontend-container"
PORT="3000"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed and running
check_docker() {
    print_status "Checking Docker installation..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    
    print_success "Docker is running"
}

# Check if docker-compose is available
check_docker_compose() {
    print_status "Checking Docker Compose..."
    
    if ! command -v docker-compose &> /dev/null; then
        print_warning "docker-compose not found, trying 'docker compose'..."
        if ! docker compose version &> /dev/null; then
            print_error "Neither docker-compose nor 'docker compose' is available."
            exit 1
        fi
        COMPOSE_CMD="docker compose"
    else
        COMPOSE_CMD="docker-compose"
    fi
    
    print_success "Docker Compose is available"
}

# Build the Docker image
build_image() {
    print_status "Building Docker image..."
    
    if [ "$COMPOSE_CMD" = "docker-compose" ]; then
        $COMPOSE_CMD build --no-cache
    else
        $COMPOSE_CMD build --no-cache
    fi
    
    if [ $? -eq 0 ]; then
        print_success "Docker image built successfully"
    else
        print_error "Failed to build Docker image"
        exit 1
    fi
}

# Stop and remove existing container
cleanup_existing() {
    print_status "Cleaning up existing containers..."
    
    # Stop existing container
    if docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
        print_status "Stopping existing container..."
        docker stop $CONTAINER_NAME
        print_success "Container stopped"
    fi
    
    # Remove existing container
    if docker ps -aq -f name=$CONTAINER_NAME | grep -q .; then
        print_status "Removing existing container..."
        docker rm $CONTAINER_NAME
        print_success "Container removed"
    fi
}

# Deploy the application
deploy() {
    print_status "Deploying application..."
    
    if [ "$COMPOSE_CMD" = "docker-compose" ]; then
        $COMPOSE_CMD up -d
    else
        $COMPOSE_CMD up -d
    fi
    
    if [ $? -eq 0 ]; then
        print_success "Application deployed successfully"
    else
        print_error "Failed to deploy application"
        exit 1
    fi
}

# Wait for application to be ready
wait_for_ready() {
    print_status "Waiting for application to be ready..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:$PORT/api/health &> /dev/null; then
            print_success "Application is ready!"
            return 0
        fi
        
        print_status "Attempt $attempt/$max_attempts - Application not ready yet..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_error "Application failed to become ready after $max_attempts attempts"
    return 1
}

# Show deployment status
show_status() {
    print_status "Deployment Status:"
    echo ""
    
    # Show running containers
    docker ps --filter "name=$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    echo ""
    print_status "Application URLs:"
    echo "   - Local: http://localhost:$PORT"
    echo "   - Health Check: http://localhost:$PORT/api/health"
    
    echo ""
    print_status "Useful commands:"
    echo "   - View logs: docker logs $CONTAINER_NAME"
    echo "   - Stop app: docker-compose down"
    echo "   - Restart app: docker-compose restart"
}

# Main deployment process
main() {
    echo "=========================================="
    echo "   Midora AI Frontend Deployment"
    echo "=========================================="
    echo ""
    
    # Run checks
    check_docker
    check_docker_compose
    
    # Build and deploy
    build_image
    cleanup_existing
    deploy
    
    # Wait for readiness
    if wait_for_ready; then
        show_status
        print_success "Deployment completed successfully! 🎉"
    else
        print_error "Deployment failed! ❌"
        exit 1
    fi
}

# Run main function
main "$@"
