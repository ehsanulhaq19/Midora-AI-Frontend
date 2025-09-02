# Midora AI Frontend

A modern, dockerized Next.js application built with TypeScript, Tailwind CSS, and best practices for optimal performance and developer experience.

## 🚀 Features

- **Next.js 14** with App Router for modern React development
- **TypeScript** for type safety and better developer experience
- **Tailwind CSS** for utility-first styling
- **Docker** support with multi-stage builds for production
- **Frontend-Only Architecture** communicating with external backend services
- **Responsive Design** with mobile-first approach
- **Performance Optimized** with Next.js best practices and Redis caching
- **SEO Ready** with metadata API and proper structure
- **Error Handling** with error boundaries and loading states
- **API Routes** with proper validation and error handling
- **Backend Communication** utilities for both client and server-side API calls
- **Testing Ready** with Jest and Testing Library setup

## 🏗️ Architecture

This is a **frontend-only application** that communicates with external backend services (3rd party APIs or localhost:8000).

```
src/
├── app/                    # App Router (Next.js 13+)
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── loading.tsx        # Loading states
│   ├── error.tsx          # Error boundaries
│   ├── not-found.tsx      # 404 page
│   └── api/               # Frontend API routes
├── components/            # Reusable components
│   └── ui/               # UI components
├── lib/                  # Utility functions
│   └── backend-api.ts    # Backend communication utilities
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── styles/               # Additional styles
```

### 🔗 Backend Communication

- **Client-side**: Uses `NEXT_PUBLIC_BACKEND_URL` for browser API calls
- **Server-side**: Uses `BACKEND_API_URL` for server-side API calls
- **API Utilities**: Built-in functions in `src/lib/backend-api.ts`
- **Caching**: Optional Redis for frontend caching and sessions

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with class-variance-authority
- **Validation**: Zod
- **Containerization**: Docker
- **Package Manager**: npm
- **Linting**: ESLint
- **Testing**: Jest + Testing Library

## 📋 Prerequisites

- Node.js 18+ 
- npm 8+
- Docker (for containerized deployment)
- Docker Compose

## 🚀 Quick Start

### Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd midora.ai-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

The project uses a **single multi-stage Dockerfile** with **three separate Docker Compose configurations** for different environments:

#### Local Development (Recommended for developers)
```bash
# Start local development with hot reloading
docker-compose -f docker-compose.local.yml up --build
```

#### Development Environment (with Redis caching)
```bash
# Start development with Redis caching
docker-compose -f docker-compose.dev.yml up --build
```

#### Live Production (with Redis caching)
```bash
# Start live production environment
docker-compose -f docker-compose.live.yml --env-file .env.live up --build
```

### Docker Compose Commands

1. **Start services**
   ```bash
   docker-compose up --build
   ```

2. **Run in background**
   ```bash
   docker-compose up -d --build
   ```

3. **Stop services**
   ```bash
   docker-compose down
   ```

4. **View logs**
   ```bash
   docker-compose logs -f app
   ```

For detailed Docker setup and usage, see [Docker Setup Guide](./docs/docker-setup-guide.md).

### Using Docker directly

1. **Build the Docker image**
   ```bash
   docker build -t midora-ai-frontend .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 midora-ai-frontend
   ```

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file based on `env.example`:

```bash
# Application
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
CUSTOM_KEY=your_custom_key_here
```

### Next.js Configuration

The application uses a custom `next.config.js` with:

- App Router enabled
- Standalone output for Docker optimization
- Security headers
- Image optimization settings

### Tailwind CSS Configuration

Custom Tailwind configuration in `tailwind.config.js` with:

- Extended color palette
- Custom spacing and typography
- Component-specific utilities

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

```
tests/
├── __mocks__/           # Mock files
├── components/          # Component tests
└── utils/              # Utility function tests
```

## 📚 API Documentation

### Health Check

```
GET /api/health
```

Returns application health status and version information.

### Hello API

```
GET /api/hello
POST /api/hello
```

Simple API endpoint for testing and demonstration.

## 🎨 Component Library

### UI Components

- **Button** - Multiple variants and sizes
- **LoadingSpinner** - Configurable loading indicators
- **ErrorDisplay** - Error boundary display
- **NotFoundDisplay** - 404 page display

### Component Features

- TypeScript interfaces for all props
- Variant system using class-variance-authority
- Responsive design with Tailwind CSS
- Accessibility features (ARIA labels, keyboard navigation)

## 🔒 Security Features

- Security headers in Next.js config
- Input validation with Zod schemas
- Error boundaries for graceful error handling
- Environment variable protection

## 📱 Responsive Design

- Mobile-first approach
- Breakpoint system using Tailwind CSS
- Flexible grid layouts
- Touch-friendly interactions

## 🚀 Performance Optimizations

- Next.js Image component for optimized images
- Code splitting and dynamic imports
- Static generation where possible
- Bundle optimization
- Docker multi-stage builds

## 📖 Documentation

- [Component Documentation](./docs/components.md)
- [API Documentation](./docs/api.md)
- [Deployment Guide](./docs/deployment.md)
- [Contributing Guidelines](./docs/contributing.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the [docs](./docs/) folder
- **Issues**: Report bugs and feature requests via GitHub Issues
- **Discussions**: Join the conversation in GitHub Discussions

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- Tailwind CSS team for the utility-first CSS framework
- The open-source community for inspiration and tools

---

**Built with ❤️ by the Midora AI Team**
