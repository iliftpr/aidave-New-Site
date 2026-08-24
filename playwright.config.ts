import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'e2e',
  timeout: 60_000,
  retries: 0,
  use: { baseURL: 'http://localhost:3111', headless: true },
  // Production server, not `next dev`: it is what Vercel runs, and dev needs extras (critters for
  // optimizeCss) that the build bundles itself.
  webServer: {
    command: 'npx next build && npx next start -p 3111',
    url: 'http://localhost:3111/lp/contractors',
    reuseExistingServer: true,
    timeout: 300_000,
    env: {
      LEADS_SUPABASE_URL: '',
      LEADS_SUPABASE_SERVICE_KEY: '',
      NEXT_PUBLIC_META_PIXEL_ID: '1192402142237152',
    },
  },
})
