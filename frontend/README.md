# Frontend - Generate Awesome

A modern, responsive frontend built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

- 🎨 Beautiful landing page with hero section
- 🚀 Interactive dashboard for project generation
- 👀 Live preview of generated projects
- 📱 Fully responsive design
- 🎯 Modern UI with shadcn/ui components
- ⚡ Fast development with Next.js 16
- 🎭 Smooth animations with Framer Motion

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (will be installed automatically if not present)

### Installation

1. Navigate to the frontend directory:
   ```powershell
   cd frontend
   ```

2. Install dependencies:
   ```powershell
   pnpm install
   ```

3. Start the development server:
   ```powershell
   pnpm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── dashboard/      # Dashboard page
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── hero-section.tsx
│   │   ├── project-preview.tsx
│   │   └── ...
│   └── lib/
│       └── utils.ts        # Utility functions
├── public/                 # Static assets
├── .env.local             # Environment variables
└── package.json
```

## Environment Variables

Create a `.env.local` file in the frontend directory:

```env
BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME="Generate Awesome"
NEXT_PUBLIC_APP_DESCRIPTION="AI-Powered Project Generator"
```

## Features Overview

### Landing Page
- Hero section with animated content
- Feature showcase
- Company logos slider
- Call-to-action buttons

### Dashboard
- Project generation form
- Project gallery with previews
- Live project preview in iframe
- Code viewing (HTML, CSS, JS)
- One-click project download

### API Integration
- `/api/generate` - Connects to Python backend
- Fallback to mock data when backend unavailable
- Error handling and user feedback

## Customization

### Adding New Components
```bash
pnpm dlx shadcn add [component-name]
```

### Styling
- Edit `src/app/globals.css` for global styles
- Use Tailwind classes for component styling
- shadcn/ui components are fully customizable

## Deployment

### Build for Production
```powershell
pnpm build
```

### Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## Contributing

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Follow the component pattern established
4. Add proper error handling
5. Test on multiple screen sizes

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the port in `package.json` or kill the process using port 3000
2. **Build errors**: Clear `.next` folder and rebuild
3. **TypeScript errors**: Check all imports and type definitions
4. **Styling issues**: Verify Tailwind CSS installation and configuration
