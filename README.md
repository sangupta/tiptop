# Tiptop Rich Text Editor

A modern, AI-enhanced collaborative rich text editor built with Tiptap and Preact.

> [!IMPORTANT]
> Tiptop has been eniterly vibe coded using Amazon Kiro in its preview period. 

## Features

- 🎨 Rich text formatting with comprehensive typography controls
- 🤝 Real-time collaborative editing with YJS
- 🤖 AI-powered content generation and editing assistance
- 📱 Responsive design with mobile support
- ♿ Full accessibility compliance (WCAG 2.1 AA)
- 🎯 TypeScript-first with strict type safety
- 🧪 Comprehensive testing with Vitest and Playwright

## Tech Stack

- **Framework**: Preact with TypeScript
- **Editor**: Tiptap (ProseMirror-based)
- **Styling**: Tailwind CSS 4.0
- **Build Tool**: Vite
- **Testing**: Vitest (unit/integration) + Playwright (E2E)
- **Collaboration**: YJS with WebSocket provider
- **Code Quality**: Prettier + TypeScript strict mode

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run unit and integration tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Type checking
npm run type-check

# Code formatting
npm run format
npm run format:check
```

### Project Structure

```
src/
├── components/     # Preact UI components
├── extensions/     # Custom Tiptap extensions
├── services/       # AI and collaboration services
├── utils/          # Helper functions and utilities
├── types/          # TypeScript type definitions
├── styles/         # Tailwind CSS and custom styles
└── main.tsx        # Application entry point

tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
└── e2e/            # End-to-end tests
```

## License

MIT
