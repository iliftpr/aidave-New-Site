# ILift Website - AI-Powered Web Development Agency

A modern, heavily animated website for ILift, showcasing AI-powered web development services, voice agents, and marketing automation.

## Features

- **Modern Hero Section** with animated typing effect
- **8 Service Cards** with scroll-triggered animations
- **Portfolio Showcase** displaying 4 industry-specific projects
- **Infinite Scrolling Reviews** with Google My Business style cards
- **AI Voice Agent Demo** section highlighting automation capabilities
- **LeadConnector Integration** for chat widget and audit forms
- **Calendly Integration** for appointment booking
- **Fully Responsive** design for all devices
- **SEO Optimized** with metadata, structured data, and local SEO
- **Performance Optimized** with Next.js and Framer Motion animations

## Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Typing Effect**: React-Type-Animation
- **Deployment**: Optimized for Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Project Structure

\`\`\`
├── app/
│   ├── layout.tsx          # Root layout with SEO metadata
│   ├── page.tsx            # Main landing page
│   ├── globals.css         # Global styles
│   ├── sitemap.ts          # Dynamic sitemap
│   └── robots.ts           # Robots.txt configuration
├── components/
│   ├── layout/
│   │   ├── Header.tsx      # Sticky navigation
│   │   └── Footer.tsx      # Footer with contact info
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── PortfolioSection.tsx
│   │   ├── AIVoiceDemo.tsx
│   │   ├── ReviewsSection.tsx
│   │   ├── AuditFormSection.tsx
│   │   └── ContactSection.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── ServiceCard.tsx
│   │   ├── PortfolioCard.tsx
│   │   └── ReviewCard.tsx
│   └── animations/
│       └── ScrollReveal.tsx
├── lib/
│   ├── constants.ts        # Company info, services, reviews data
│   └── animations.ts       # Framer Motion variants
└── types/
    └── index.ts           # TypeScript interfaces
\`\`\`

## Configuration

### Update Company Information

Edit `lib/constants.ts` to update:
- Company name, phone, email, address
- Service descriptions
- Portfolio items
- Review testimonials
- Social media links

### Update Integrations

1. **LeadConnector Chat Widget**: Update the widget ID in `app/layout.tsx`
2. **Calendly Link**: Update in `lib/constants.ts`
3. **Audit Form**: Update iframe src in `components/sections/AuditFormSection.tsx`

## Adding Portfolio Images

1. Create portfolio mockups using tools like:
   - Figma/Canva + device mockups
   - Nano Banana Pro (AI generation)
   - Screenshots of real client websites

2. Export images as WebP format (85% quality)

3. Save to `public/images/portfolio/`:
   - `spa-desktop.webp` / `spa-mobile.webp`
   - `plumber-desktop.webp` / `plumber-mobile.webp`
   - `construction-desktop.webp` / `construction-mobile.webp`
   - `law-desktop.webp` / `law-mobile.webp`

4. Update placeholder emoji in `components/ui/PortfolioCard.tsx` with actual images

## SEO Optimization

The site includes:
- Metadata API configuration in `app/layout.tsx`
- Structured data (LocalBusiness schema) ready to implement
- Dynamic sitemap generation
- Robots.txt configuration
- Local SEO keywords for East Meadow, NY

### To Complete SEO Setup:

1. Add Google verification code to `app/layout.tsx`
2. Create OG images: `public/og-image.jpg` (1200x630)
3. Submit sitemap to Google Search Console
4. Set up Google Business Profile and link to website

## Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure domain
4. Deploy!

Vercel automatically optimizes Next.js applications.

### Environment Variables

No environment variables required for basic functionality.

## Performance

Target metrics:
- **Lighthouse Performance**: 90+
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **JavaScript Bundle**: < 200KB
- **Mobile Responsive**: All devices 320px+

## Animations

The site uses Framer Motion for:
- Scroll-triggered fade-in and slide-up effects
- Hover animations on buttons and cards
- Smooth page transitions
- Respects `prefers-reduced-motion` for accessibility

## Contact

**ILift Website Design & Digital Marketing**
- Phone: 855-905-3407
- Email: dave@ilift.com
- Address: 1738 Bard Lane, East Meadow, NY 11554
- App: [app.ilift.com](https://app.ilift.com)

## License

All rights reserved © 2024 ILift Website Design & Digital Marketing
