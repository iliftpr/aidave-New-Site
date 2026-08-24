/** All lead-machine env reads live here so the variable names exist in exactly one place. */
export const env = {
  supabaseUrl: () => process.env.LEADS_SUPABASE_URL ?? '',
  supabaseServiceKey: () => process.env.LEADS_SUPABASE_SERVICE_KEY ?? '',
  smsEnabled: () => process.env.LEAD_SMS_ENABLED === '1',
  twilioSid: () => process.env.TWILIO_ACCOUNT_SID ?? '',
  twilioToken: () => process.env.TWILIO_AUTH_TOKEN ?? '',
  twilioFrom: () => process.env.TWILIO_FROM ?? '',
  telegramToken: () => process.env.TELEGRAM_BOT_TOKEN ?? '',
  telegramChatId: () => process.env.TELEGRAM_CHAT_ID ?? '',
  metaPixelId: () => process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '',
  metaCapiToken: () => process.env.META_CAPI_TOKEN ?? '',
  metaPageToken: () => process.env.META_PAGE_TOKEN ?? '',
  metaLeadFormIds: () =>
    (process.env.META_LEAD_FORM_IDS ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  metaGraphVersion: () => process.env.META_GRAPH_VERSION ?? 'v21.0',
  cronSecret: () => process.env.CRON_SECRET ?? '',
  resendKey: () => process.env.RESEND_API_KEY ?? '',
  siteUrl: () => process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.ilift.com',
  auditUrl: () => 'https://cal.com/ilift/automation-audit',
  dashUser: () => process.env.LEADS_DASH_USER ?? '',
  dashPass: () => process.env.LEADS_DASH_PASS ?? '',
}
