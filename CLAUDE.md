# CLAUDE.md - AI Assistant Guide for ILift Website

This document provides essential context for AI assistants working on this codebase.

## Project Overview

**Project**: ILift Website - AI-Powered Web Development Agency Landing Page
**Framework**: Next.js 16 (App Router) + React 19
**Language**: TypeScript 5.9
**Styling**: Tailwind CSS 4 + Custom CSS
**Animations**: Framer Motion 12

A modern, heavily animated landing page for ILift, showcasing AI-powered web development services, voice agents, and marketing automation.

## Quick Reference Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run ESLint
```

## Directory Structure

```
aidave-New-Site/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout (SEO, fonts, scripts)
│   ├── page.tsx                 # Main landing page
│   ├── globals.css              # Global styles + Tailwind
│   ├── sitemap.ts               # Dynamic sitemap generation
│   └── robots.ts                # Robots.txt configuration
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx           # Sticky navigation + mobile menu
│   │   └── Footer.tsx           # Footer with contact info
│   │
│   ├── sections/                # Full-page section components
│   │   ├── HeroSection.tsx      # Hero with typing animation
│   │   ├── ServicesSection.tsx  # 8 service cards grid
│   │   ├── AIVoiceDemo.tsx      # AI assistant demo section
│   │   ├── PortfolioSection.tsx # Portfolio showcase
│   │   ├── ReviewsSection.tsx   # Infinite scrolling reviews
│   │   ├── AuditFormSection.tsx # LeadConnector form iframe
│   │   └── ContactSection.tsx   # Contact methods + CTA
│   │
│   ├── ui/                      # Reusable UI components
│   │   ├── Button.tsx           # Polymorphic button (link/button)
│   │   ├── ServiceCard.tsx      # Service card with icon/features
│   │   ├── PortfolioCard.tsx    # Portfolio item card
│   │   └── ReviewCard.tsx       # Review testimonial card
│   │
│   └── animations/
│       └── ScrollReveal.tsx     # Scroll-triggered animation wrapper
│
├── lib/
│   ├── constants.ts             # ALL static data (company, services, reviews)
│   └── animations.ts            # Framer Motion animation variants
│
├── types/
│   └── index.ts                 # TypeScript interfaces
│
└── public/
    ├── images/portfolio/        # Portfolio mockup images
    └── logo-v3.png              # Brand logo
```

## Key Files to Know

| File | Purpose |
|------|---------|
| `lib/constants.ts` | **Single source of truth** for all content (company info, services, reviews, portfolio) |
| `app/layout.tsx` | Root HTML layout with SEO metadata, Google Fonts, LeadConnector widget, JSON-LD schema |
| `app/page.tsx` | Landing page - imports and orders all section components |
| `types/index.ts` | TypeScript interfaces (Service, Review, PortfolioItem) |
| `app/globals.css` | Custom CSS classes: `.glass`, `.gradient-text`, `.section-padding` |

## Code Conventions

### Component Patterns

**Client Components** (use `'use client'` directive):
- All interactive components (Header, Button, sections)
- Animation-heavy components (Framer Motion)
- Components using React hooks (useState, useEffect)

**Server Components** (default, no directive):
- Layout, sitemap, robots configuration
- Static metadata

### File Naming
- Components: `PascalCase.tsx` (e.g., `HeroSection.tsx`)
- Utilities: `camelCase.ts` (e.g., `animations.ts`)
- Constants: `UPPERCASE_SNAKE_CASE` (e.g., `COMPANY_INFO`)

### Styling Approach
```tsx
// Tailwind utility classes (primary approach)
className="flex items-center justify-between gap-4 p-6 rounded-xl"

// Custom CSS classes from globals.css
className="glass gradient-text section-padding container-custom"
```

### Animation Pattern
```tsx
// Framer Motion with scroll-triggered animations
<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-100px' }}
  transition={{ duration: 0.5, delay: index * 0.1 }}
/>
```

### Icon Usage
```tsx
import * as Icons from 'lucide-react'

// Dynamic icon rendering (icon name from constants)
const Icon = (Icons as any)[service.icon] || Icons.Zap
```

## Data Management

All content lives in `lib/constants.ts`:

- **COMPANY_INFO**: Name, phone, email, address, social links, external URLs
- **SERVICES**: Array of 8 services with id, title, description, icon, features
- **REVIEWS**: Array of 8 customer testimonials
- **PORTFOLIO**: Array of 4 portfolio items with images
- **NAV_LINKS**: Navigation menu items
- **HERO_TYPING_PHRASES**: Rotating hero text

**To update content**: Edit `lib/constants.ts` - changes propagate site-wide.

## External Integrations

| Integration | Location | Purpose |
|-------------|----------|---------|
| LeadConnector Chat Widget | `app/layout.tsx` | Live chat widget |
| LeadConnector Form | `components/sections/AuditFormSection.tsx` | Audit form iframe |
| Calendly | `lib/constants.ts` (COMPANY_INFO.links.calendly) | Appointment booking |
| Google Maps | `components/sections/ContactSection.tsx` | Embedded map |

## TypeScript Interfaces

```typescript
// types/index.ts
interface Service {
  id: string
  title: string
  description: string
  icon: string        // Lucide icon name
  features: string[]
}

interface Review {
  id: string
  name: string
  business: string
  industry: string
  rating: number
  text: string
  avatar: string
}

interface PortfolioItem {
  id: string
  title: string
  industry: string
  description: string
  features: string[]
  imageDesktop: string
  imageMobile: string
}
```

## Common Tasks

### Adding a New Service
1. Add to `SERVICES` array in `lib/constants.ts`
2. Choose icon name from [Lucide Icons](https://lucide.dev/icons)

### Adding a Portfolio Item
1. Add images to `public/images/portfolio/`
2. Add entry to `PORTFOLIO` array in `lib/constants.ts`

### Modifying SEO
- Meta tags: `app/layout.tsx` (metadata export)
- Structured data: `app/layout.tsx` (JSON-LD script)
- Sitemap: `app/sitemap.ts`
- Robots: `app/robots.ts`

### Adding a New Section
1. Create component in `components/sections/NewSection.tsx`
2. Use `'use client'` if interactive
3. Import and add to `app/page.tsx`

## Important Notes

- **No testing setup** - No Jest/Vitest configured
- **No .env required** - All config is in code
- **Vercel deployment** - Optimized for Vercel hosting
- **Accessibility** - Supports `prefers-reduced-motion`
- **Images** - Use WebP format, leverage Next.js Image optimization
- **Path alias** - Use `@/` for imports (maps to project root)

## Color System

```
Primary:   sky-500 (#0ea5e9) - CTAs, highlights
Secondary: purple-500 (#a855f7) - Gradients, accents
Gray:      900-50 scale - Text and backgrounds
```

## Responsive Breakpoints

```
Mobile:  < 640px (default)
sm:      >= 640px
md:      >= 768px
lg:      >= 1024px
xl:      >= 1280px
```

## Performance Targets

- Lighthouse Performance: 90+
- LCP < 2.5s, FID < 100ms, CLS < 0.1
- JavaScript Bundle: < 200KB

## Dependencies

Key packages:
- `next`: ^16.0.7
- `react`: ^19.2.1
- `tailwindcss`: ^4.1.17
- `framer-motion`: ^12.23.25
- `lucide-react`: ^0.555.0
- `react-type-animation`: ^3.2.0
