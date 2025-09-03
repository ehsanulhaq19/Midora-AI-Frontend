# Midora AI - Multi-Model AI Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.0.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Midora is a comprehensive AI platform that provides access to multiple AI models including OpenAI, Gemini, DeepSeek, and Claude. The platform also offers powerful tools like AI detection, plagiarism checking, AI humanization, and market intelligence features including stock alerts and financial analysis tools.

## ✨ Features

### 🤖 AI Models
- **OpenAI GPT-4** - Advanced language model for complex reasoning
- **Google Gemini** - Multimodal AI for text, images, and code
- **Anthropic Claude** - Constitutional AI focused on safety
- **DeepSeek** - Specialized in code generation and technical tasks

### 🛠️ AI Tools
- **AI Detector** - Identify AI-generated content with high accuracy
- **Plagiarism Checker** - Comprehensive plagiarism detection
- **AI Humanizer** - Transform AI content to appear more natural
- **Content Analyzer** - Deep content quality analysis

### 📊 Market Intelligence
- **Stock Alerts** - Real-time price movement notifications
- **Market Analysis** - AI-powered insights and predictions
- **Portfolio Tracking** - Comprehensive portfolio management
- **Risk Assessment** - AI-driven risk analysis

### 🎨 Design Philosophy
- **Simplified & Elegant** - Clean, uncluttered interface
- **Darkest Purple Theme** - Sophisticated dark purple background (`#3b0764`)
- **Sequential Animations** - Content appears one by one with smooth transitions
- **Hide & Show Effects** - Smooth transitions between content states
- **High Contrast** - White text on dark background for maximum readability
- **Minimal Elements** - Focus on content without visual clutter

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/midora.ai-frontend.git
   cd midora.ai-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   Edit `.env.local` with your configuration values.

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
midora.ai-frontend/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── pages/          # Page components
│   │   │   ├── home.tsx    # Home page component
│   │   │   └── about.tsx   # About page component
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Main page (imports from pages/)
│   ├── components/         # React components
│   │   └── ui/            # UI components
│   │       ├── Header.tsx  # Simple navigation header
│   │       └── SimpleHome.tsx # Animated home content
│   ├── lib/               # Utility functions
│   │   ├── theme.ts       # Theme configuration
│   │   └── utils.ts       # General utilities
│   └── types/             # TypeScript type definitions
├── docs/                  # Documentation
├── public/                # Static assets
├── tailwind.config.js     # Tailwind CSS configuration
└── package.json           # Dependencies and scripts
```

## 🎨 Design System

### Simplified Dark Theme
Midora uses a **simplified, elegant design approach** with:

- **Primary Background**: **Darkest purple** (`#3b0764`) for sophisticated appearance
- **Header Background**: Darkest purple (`#3b0764`) for navbar
- **Text Colors**: White and light purple for maximum contrast and readability
- **Minimal Elements**: Clean, focused design without visual clutter
- **Sequential Animations**: Content appears one by one with smooth transitions and hide/show effects

### Key Design Principles
1. **Simplicity First** - Clean, uncluttered interface
2. **High Contrast** - Dark background with white text for readability
3. **Sequential Reveal** - Content appears in a logical, animated sequence
4. **Hide & Show Effects** - Smooth transitions between content states
5. **Elegant Typography** - Large, bold headlines with clear hierarchy
6. **Smooth Animations** - Subtle, professional transitions

### Theme Features
- **Color Palette**: Darkest purple design with semantic colors
- **Typography**: Inter font family with consistent sizing scale
- **Spacing**: 8px grid system for consistent layouts
- **Animations**: Custom keyframes and smooth transitions
- **Components**: Minimal, focused UI components

For detailed theme documentation, see [docs/theme-system.md](docs/theme-system.md).

## 📄 Page Structure

### Pages Directory
All page components are organized in `src/app/pages/` for better code organization:

- **`home.tsx`** - Main home page with animated content
- **`about.tsx`** - About page example
- **Future pages** - Will be added here following the same pattern

### Main Page
The main `src/app/page.tsx` imports and renders the appropriate page component:

```typescript
import HomePage from './pages/home'

export default function Page() {
  return <HomePage />
}
```

This structure allows for:
- **Better Organization** - Clear separation of page components
- **Easier Maintenance** - Each page is self-contained
- **Scalability** - Easy to add new pages following the same pattern
- **Code Reusability** - Common components can be shared between pages

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

### Code Quality

- **TypeScript** - Full type safety
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Jest** - Unit testing framework

### Component Development

Components are built using:
- **React 18** - Latest React features
- **TypeScript** - Type-safe component props
- **Tailwind CSS** - Utility-first styling
- **Class Variance Authority** - Component variants

### Adding New Pages

To add a new page:

1. **Create the page component** in `src/app/pages/`
2. **Follow the naming convention** - `pageName.tsx`
3. **Include the Header component** for consistent navigation
4. **Use the theme colors** from the design system
5. **Update routing** if needed

Example:
```typescript
// src/app/pages/features.tsx
'use client'

import { Header } from '@/components/ui/Header'

export default function FeaturesPage() {
  return (
    <main className="min-h-screen">
      <Header />
      {/* Page content */}
    </main>
  )
}
```

## 🐳 Docker

### Development Environment

```bash
docker-compose -f docker-compose.dev.yml up
```

### Production Build

```bash
docker-compose -f docker-compose.live.yml up
```

### Local Development

```bash
docker-compose -f docker-compose.local.yml up
```

For detailed Docker setup instructions, see [docs/docker-setup-guide.md](docs/docker-setup-guide.md).

## 📚 Documentation

- [Theme System](docs/theme-system.md) - Complete theme documentation
- [Components](docs/components.md) - Component library documentation
- [API Reference](docs/api.md) - API endpoints and usage
- [Deployment](docs/deployment.md) - Deployment guides
- [Docker Guide](docs/docker-setup-guide.md) - Docker setup and usage

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Standards

- Follow TypeScript best practices
- Use consistent naming conventions
- Write meaningful commit messages
- Include JSDoc comments for complex functions
- Ensure responsive design principles
- **Maintain simplicity** - Keep the design clean and focused
- **Follow page structure** - Use the pages directory for new pages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/your-org/midora.ai-frontend/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/midora.ai-frontend/discussions)

## 🙏 Acknowledgments

- **Next.js** - React framework
- **Tailwind CSS** - Utility-first CSS framework
- **Inter Font** - Beautiful typography
- **React Community** - Amazing ecosystem

---

Built with ❤️ by the Midora AI Team
