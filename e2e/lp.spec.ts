import { test, expect } from '@playwright/test'

const FBQ_STUB =
  'window.fbq=function(){var q=(window.__fbq=window.__fbq||[]);q.push([].slice.call(arguments))};window.fbq.loaded=true;'

test('LP form submits and the thanks page fires a deduped Lead', async ({ page }) => {
  await page.route('**/api/lead', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, eid: 'e2e-evt-1' }) }),
  )
  await page.route('https://connect.facebook.net/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/javascript', body: FBQ_STUB }),
  )
  await page.route('https://www.facebook.com/tr/**', (route) => route.fulfill({ status: 200, body: '' }))

  await page.goto('/lp/contractors?utm_source=meta&utm_campaign=nmc')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Stop sending jobs to voicemail')

  await page.getByLabel('Your name').fill('Test Lead')
  await page.getByLabel('Mobile number').fill('516-555-0100')
  await page.getByLabel('Business name').fill('E2E HVAC')
  await page.getByLabel(/costing you the most/).selectOption('missed_calls')

  const [req] = await Promise.all([
    page.waitForRequest('**/api/lead'),
    page.getByRole('button', { name: /Text me the details/ }).click(),
  ])
  const body = req.postDataJSON() as { vertical: string; tracking: Record<string, string>; eventId: string }
  expect(body.vertical).toBe('contractors')
  expect(body.tracking.utm_campaign).toBe('nmc')
  expect(body.eventId).toBeTruthy()

  await expect(page).toHaveURL(/\/lp\/contractors\/thanks\?eid=e2e-evt-1/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Dave is texting you now')
  await expect
    .poll(async () => JSON.stringify(await page.evaluate(() => (window as unknown as { __fbq?: unknown[][] }).__fbq ?? [])))
    .toContain('e2e-evt-1')
})

test('honeypot submissions still post but the server swallows them', async ({ page }) => {
  let posted: Record<string, unknown> | null = null
  await page.route('**/api/lead', (route) => {
    posted = route.request().postDataJSON() as Record<string, unknown>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' })
  })
  await page.route('https://connect.facebook.net/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/javascript', body: FBQ_STUB }),
  )
  await page.goto('/lp/restaurants')
  await page.locator('input[name="website"]').fill('http://spam', { force: true })
  await page.getByLabel('Your name').fill('Bot')
  await page.getByLabel('Mobile number').fill('516-555-0100')
  await page.getByLabel('Business name').fill('Bot Co')
  await page.getByLabel(/costing you the most/).selectOption('reviews')
  await page.getByRole('button', { name: /Text me the details/ }).click()
  await expect.poll(() => posted).not.toBeNull()
  expect(posted!.website).toBe('http://spam')
})

test('/leads is protected by basic auth', async ({ page }) => {
  const res = await page.goto('/leads')
  expect(res?.status()).toBe(401)
  expect(res?.headers()['www-authenticate']).toContain('Basic')
})
