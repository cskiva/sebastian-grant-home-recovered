export default function getProductionUrl() {
  const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL
  const VERCEL_PROJECT_PRODUCTION_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  return process.env.NODE_ENV === 'development'
    ? NEXT_PUBLIC_SERVER_URL
    : (VERCEL_PROJECT_PRODUCTION_URL ?? NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000')
}
