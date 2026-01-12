// import { getClientSideURL } from '@/utilities/getURL'

/**
 * Normalize media URLs to work across environments.
 * - Strips absolute origin to make it same-origin
 * - Avoids double-encoding query params
 * - Appends cache tag as ?v=<timestamp>
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

  // Normalize to relative path (strip protocol/host if present)
  let pathname = ''
  let search = ''
  try {
    const u = /^https?:\/\//i.test(url) ? new URL(url) : new URL(url, 'http://placeholder')
    pathname = u.pathname
    search = u.search
  } catch {
    pathname = url.startsWith('/') ? url : `/${url}`
  }

  // Preserve existing query params safely
  const qs = new URLSearchParams(search.replace(/^\?/, ''))

  if (cacheTag) {
    qs.set('v', cacheTag) // no encodeURIComponent needed
  }

  const query = qs.toString()
  return `${pathname}${query ? `?${query}` : ''}`
}
