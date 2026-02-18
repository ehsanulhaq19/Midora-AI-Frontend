# Deployment Guide

This document provides comprehensive instructions for deploying the Midora AI Frontend application to various environments.

## 🚀 Overview

The application can be deployed using multiple methods:
- **Docker** (Recommended for production)
- **Vercel** (Serverless deployment)
- **Traditional hosting** (Node.js server)
- **Static export** (Static hosting)

## 🐳 Docker Deployment

### Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 2GB RAM available
- 5GB disk space

### Quick Start

1. **Clone and navigate to the project**
   ```bash
   git clone <repository-url>
   cd midora.ai-frontend
   ```

2. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   Open [http://localhost:3000](http://localhost:3000)

### Production Deployment

1. **Set environment variables**
   ```bash
   cp env.example .env.production
   # Edit .env.production with production values
   ```

2. **Build and deploy**
   ```bash
   # Build the production image
   docker-compose -f docker-compose.prod.yml up --build -d
   
   # Or use the deployment script
   ./scripts/deploy.sh
   ```

3. **Verify deployment**
   ```bash
   # Check container status
   docker ps
   
   # View logs
   docker logs midora-ai-frontend-container
   
   # Health check
   curl http://localhost:3000/api/health
   ```

### Docker Configuration

#### Production Docker Compose
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_TELEMETRY_DISABLED=1
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    volumes:
      - ./logs:/app/logs
      - ./uploads:/app/uploads
```

#### Environment Variables
```bash
# Production environment
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
CUSTOM_KEY=your_production_key
```

### Docker Commands Reference

```bash
# Build image
docker build -t midora-ai-frontend .

# Run container
docker run -p 3000:3000 midora-ai-frontend

# View logs
docker logs <container_id>

# Execute commands in container
docker exec -it <container_id> /bin/sh

# Stop and remove container
docker stop <container_id> && docker rm <container_id>

# Clean up images
docker image prune -f
```

## ☁️ Vercel Deployment

### Prerequisites

- Vercel account
- Git repository
- Node.js 18+

### Deployment Steps

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

4. **Configure environment variables**
   ```bash
   vercel env add NEXT_PUBLIC_API_URL
   vercel env add CUSTOM_KEY
   ```

### Vercel Configuration

#### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 10
    }
  }
}
```

### Environment Variables in Vercel

```bash
# Set via CLI
vercel env add NODE_ENV production
vercel env add NEXT_PUBLIC_API_URL https://api.yourdomain.com

# Set via Dashboard
# Go to Project Settings > Environment Variables
```

## 🖥️ Traditional Hosting

### Prerequisites

- Node.js 18+
- npm 8+
- PM2 (for process management)
- Nginx (for reverse proxy)

### Deployment Steps

1. **Prepare the server**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   ```

2. **Clone and setup the application**
   ```bash
   git clone <repository-url>
   cd midora.ai-frontend
   
   # Install dependencies
   npm ci --only=production
   
   # Build the application
   npm run build
   ```

3. **Configure PM2**
   ```bash
   # Create PM2 ecosystem file
   cat > ecosystem.config.js << EOF
   module.exports = {
     apps: [{
       name: 'midora-ai-frontend',
       script: 'npm',
       args: 'start',
       cwd: '/path/to/your/app',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       }
     }]
   }
   EOF
   
   # Start the application
   pm2 start ecosystem.config.js
   
   # Save PM2 configuration
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Enable HTTPS with Let's Encrypt**
   ```bash
   # Install Certbot
   sudo apt install certbot python3-certbot-nginx
   
   # Get SSL certificate
   sudo certbot --nginx -d yourdomain.com
   ```

## 📦 Static Export

### Build Static Files

1. **Configure Next.js for static export**
   ```javascript
   // next.config.js
   const nextConfig = {
     output: 'export',
     trailingSlash: true,
     images: {
       unoptimized: true
     }
   }
   ```

2. **Build the application**
   ```bash
   npm run build
   ```

3. **Deploy to static hosting**
   - **Netlify**: Drag and drop the `out` folder
   - **GitHub Pages**: Push to `gh-pages` branch
   - **AWS S3**: Upload to S3 bucket
   - **CDN**: Upload to CDN provider

## 🔧 Environment Configuration

### Development Environment
```bash
# .env.local
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_API_URL=http://localhost:3000/api
CUSTOM_KEY=dev_key_here
```

### Staging Environment
```bash
# .env.staging
NODE_ENV=staging
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_API_URL=https://staging-api.yourdomain.com
CUSTOM_KEY=staging_key_here
```

### Production Environment
```bash
# .env.production
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
CUSTOM_KEY=production_key_here
```

## 📊 Monitoring and Health Checks

### Health Check Endpoint

The application provides a health check endpoint at `/api/health`:

```bash
# Test health
curl http://localhost:3000/api/health

# Expected response
{
  "status": "healthy",
  "timestamp": "2024-12-01T10:00:00.000Z",
  "uptime": 3600.5,
  "environment": "production",
  "version": "0.1.0"
}
```

### Docker Health Checks

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1
```

### Load Balancer Configuration

```nginx
# Nginx upstream with health checks
upstream app_servers {
    server 127.0.0.1:3000 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:3001 max_fails=3 fail_timeout=30s;
}

# Health check location
location /health {
    access_log off;
    return 200 "healthy\n";
    add_header Content-Type text/plain;
}
```

## 🔒 Security Configuration

### Security Headers

```javascript
// next.config.js
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
      ],
    },
  ]
}
```

### Environment Variable Security

```bash
# Never commit sensitive data
echo ".env.local" >> .gitignore
echo ".env.production" >> .gitignore

# Use secrets management
# Docker: docker secrets
# Kubernetes: secrets
# Vercel: environment variables
```

## 📈 Performance Optimization

### Build Optimization

```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer

# Optimize images
# Use Next.js Image component
# Implement lazy loading
# Use WebP format
```

### Caching Strategy

```nginx
# Nginx caching
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location ~* \.(html)$ {
    expires 1h;
    add_header Cache-Control "public, must-revalidate";
}
```

### CDN Configuration

```bash
# Configure CDN headers
Cache-Control: public, max-age=31536000, immutable
ETag: "abc123"
Last-Modified: Wed, 01 Dec 2024 10:00:00 GMT
```

## 🚨 Troubleshooting

### Common Issues

#### Docker Issues
```bash
# Container won't start
docker logs <container_id>

# Port already in use
sudo lsof -i :3000
sudo kill -9 <PID>

# Permission denied
sudo chown -R $USER:$USER .
```

#### Build Issues
```bash
# Clear Next.js cache
rm -rf .next
rm -rf node_modules
npm install

# Check Node.js version
node --version
npm --version
```

#### Runtime Issues
```bash
# Check application logs
pm2 logs midora-ai-frontend

# Restart application
pm2 restart midora-ai-frontend

# Check system resources
htop
df -h
free -h
```

### Debug Mode

```bash
# Enable debug logging
DEBUG=* npm run dev

# Docker debug mode
docker run -e DEBUG=* midora-ai-frontend

# PM2 debug mode
pm2 start ecosystem.config.js --env development
```

## 📋 Deployment Checklist

### Pre-deployment
- [ ] Environment variables configured
- [ ] Database connections tested
- [ ] API endpoints verified
- [ ] Build process tested
- [ ] Security headers configured
- [ ] SSL certificates ready

### Deployment
- [ ] Code deployed to staging
- [ ] Staging environment tested
- [ ] Production deployment executed
- [ ] Health checks passing
- [ ] Monitoring configured
- [ ] Backup procedures tested

### Post-deployment
- [ ] Application accessible
- [ ] Performance metrics normal
- [ ] Error rates acceptable
- [ ] User feedback positive
- [ ] Documentation updated
- [ ] Team notified

## 🔄 Continuous Deployment

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### Docker Hub

```bash
# Build and push to Docker Hub
docker build -t username/midora-ai-frontend:latest .
docker push username/midora-ai-frontend:latest

# Pull and run on production server
docker pull username/midora-ai-frontend:latest
docker-compose up -d
```

## 📚 Additional Resources

### Documentation
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Docker Documentation](https://docs.docker.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)

### Tools
- [Docker Compose](https://docs.docker.com/compose/)
- [PM2](https://pm2.keymetrics.io/)
- [Nginx](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/docs/)

---

**Last Updated**: December 2024  
**Version**: 0.1.0  
**Maintainer**: Midora AI Team
