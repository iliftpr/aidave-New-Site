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
    caseStudy: {
      kicker: 'Consumer app · 0 → 1',
      challenge:
        'Recreational players find matches in flaky group chats — no skill matching, no accountability, no way to know if the person who said yes actually shows up.',
      build:
        'A full consumer app: partner discovery by compatibility, two-tap match proposals, court selection, score logging with verification, a reliability-backed rating, and the leagues and tournaments happening nearby.',
      outcome:
        'Live at tennisbuddy.io — a working local tennis network, not a prototype. Built on Next.js, Supabase, and Claude + OpenAI.',
    },
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
    caseStudy: {
      kicker: 'Multi-tenant SaaS',
      challenge:
        'WordPress and WooCommerce owners drown in content, product, and support busywork — and most "AI for WordPress" tools are plugins that suggest work instead of doing it.',
      build:
        'A multi-tenant SaaS where AI agents actually run the store, managed from a fleet "Command Center" dashboard — orchestrated with Trigger.dev, billed through Stripe, on Supabase and Vercel.',
      outcome:
        'Commercially live at app.openwpagent.com with a production agent fleet.',
    },
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
    caseStudy: {
      kicker: 'Internal tooling',
      challenge:
        'Running a large AI stack with no single view of what it costs, what it is doing, or which parts actually earn their keep.',
      build:
        'A daily operator console on TanStack Start and Bun that tracks Claude sessions, API spend, and skills ROI — and writes a morning "Dream" prescription of the highest-impact next moves.',
      outcome:
        'The console I open every morning to run the whole operation — the same instinct behind the reporting systems I build for clients.',
    },
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
    caseStudy: {
      kicker: 'E-commerce · performance',
      challenge:
        'A real skincare store that was painfully slow on mobile — the kind of load time that quietly kills conversions before a shopper ever sees a product.',
      build:
        'Rebuilt and operated end-to-end on WordPress and WooCommerce with WP Rocket and Cloudflare, curating a catalog across five professional brands (Eminence, Dr. Grandel, Phyris, Sothys, ilike).',
      outcome:
        'Homepage v2 took mobile LCP from 18.4s to 3.2s with cumulative layout shift held at zero. Live and selling at organicskincare.com.',
    },
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
    caseStudy: {
      kicker: 'Payments · booking',
      challenge:
        'Selling a paid strategy session needs a paywall and scheduling that do not leak — no free bookings slipping through, no double-charges, a clean refund path.',
      build:
        'A Stripe paywall gated by Next.js middleware, wired to Cal.com Teams scheduling on a custom domain, with a refund safety net built in.',
      outcome:
        'The live funnel behind my own $297 AI Strategy Session — the same booking-and-payment plumbing I put into client sites.',
    },
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
    caseStudy: {
      kicker: 'Content ops',
      challenge:
        'Staying visible across platforms without a marketing team means most posts never get made — the work stalls at "someone should write that."',
      build:
        'A research → draft → approve → publish → log pipeline built on the Codex CLI and Markdown, with a human approval step so nothing goes out unread.',
      outcome:
        'Runs ILift’s own channels — proof the same content automation I recommend to clients holds up in daily use.',
    },
  },
]
