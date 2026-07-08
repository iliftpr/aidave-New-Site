import { ProjectItem } from '@/types'

export const BUILT_BY_DAVE: ProjectItem[] = [
  {
    id: 'tennis-buddy',
    title: 'Tennis Buddy',
    description:
      'AI-powered matchmaking and scheduling for tennis and pickleball players — find partners, courts, and games near you.',
    status: 'Beta',
    techStack: ['Next.js 16', 'Supabase', 'Claude', 'OpenAI'],
    imageDesktop: '/projects/tennis-buddy.png',
    videoSrc: '/projects/tennis-buddy.mp4',
    liveUrl: 'https://tennisbuddy.io',
  },
  {
    id: 'openwpagent',
    title: 'OpenWPAgent',
    description:
      'Multi-tenant SaaS that puts AI agents in charge of your WordPress and WooCommerce site — content, products, support, automated.',
    status: 'Live',
    techStack: ['Trigger.dev', 'Vercel', 'Stripe', 'Supabase'],
    imageDesktop: '/projects/openwpagent.png',
    videoSrc: '/projects/openwpagent.mp4',
    liveUrl: 'https://app.openwpagent.com',
  },
  {
    id: 'hermes-claude-os',
    title: 'Hermes — Claude OS',
    description:
      'A daily operator console for my entire AI stack — Claude sessions, API spend, skills ROI, and a 7 AM "Dream" prescription.',
    status: 'Personal Lab',
    techStack: ['TanStack Start', 'Bun', 'TypeScript'],
    imageDesktop: '/projects/hermes.png',
    videoSrc: '/projects/hermes.mp4',
  },
  {
    id: 'organic-skincare',
    title: 'Organic Skincare',
    description:
      'E-commerce store I built and run end-to-end — homepage v2 took mobile LCP from 18.4s to 3.2s while keeping CLS at zero.',
    status: 'Live',
    techStack: ['WordPress', 'WooCommerce', 'WP Rocket', 'Cloudflare'],
    imageDesktop: '/projects/organic-skincare.png',
    videoSrc: '/projects/organic-skincare.mp4',
    liveUrl: 'https://organicskincare.com',
  },
  {
    id: 'ilift-booking',
    title: 'iLift Booking Funnel',
    description:
      'My own $297 AI Strategy Session funnel — Stripe paywall, Cal.com Teams scheduling, custom domain, refund safety net.',
    status: 'Live',
    techStack: ['Cal.com', 'Stripe', 'Next.js middleware'],
    imageDesktop: '/projects/ilift-booking.png',
    videoSrc: '/projects/ilift-booking.mp4',
    liveUrl: 'https://cal.com/ilift/ai-strategy-session',
  },
  {
    id: 'marketing-command-center',
    title: 'Marketing Command Center',
    description:
      'The content + engagement ops system behind ILift’s own social channels — research, draft, approve, publish, log.',
    status: 'Personal Lab',
    techStack: ['Codex CLI', 'Markdown', 'Approval workflow'],
    imageDesktop: '/projects/marketing-command-center.png',
    videoSrc: '/projects/marketing-command-center.mp4',
  },
]
