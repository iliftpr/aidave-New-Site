import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'e2e',
  timeout: 60_000,
  retries: 0,
  use: { baseURL: 'http://localhost:3111', headless: true },
  webServer: {
    command: 'npx next dev -p 3111',
    url: 'http://localhost:3111/lp/contractors',
    reuseExistingServer: true,
    timeout: 180_000,
    env: {
      LEADS_SUPABASE_URL: '',
      LEADS_SUPABASE_SERVICE_KEY: '',
      NEXT_PUBLIC_META_PIXEL_ID: '1192402142237152',
    },
  },
})
