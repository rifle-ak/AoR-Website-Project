/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER_ADDRESS: string
  readonly VITE_SERVER_NAME: string
  readonly VITE_API_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_DISCORD_INVITE: string
  readonly VITE_TWITTER_URL: string
  readonly VITE_YOUTUBE_URL: string
  readonly VITE_INSTAGRAM_URL: string
  readonly VITE_DONATE_URL: string
  readonly VITE_CONTACT_EMAIL: string
  readonly VITE_ENABLE_AUTH: string
  readonly VITE_ENABLE_DISCORD_BOT: string
  readonly VITE_ENABLE_LEADERBOARDS: string
  readonly VITE_ENABLE_REAL_SERVER_STATUS: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_SERVER_IP: string
  readonly VITE_SERVER_PORT: string
  readonly VITE_SERVER_MAX_PLAYERS: string
  readonly VITE_NEXT_WIPE_DATE: string
  readonly VITE_NEXT_WIPE_TYPE: string
  readonly VITE_LAST_WIPE_DATE: string
  readonly VITE_MAP_SIZE: string
  readonly VITE_GA_TRACKING_ID: string
  readonly VITE_SENTRY_DSN: string
  readonly VITE_SENTRY_ENVIRONMENT: string
  readonly VITE_ERROR_LOGGING_ENDPOINT: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
