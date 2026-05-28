const joinUrl = (base: string, path: string) => {
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  return new URL(path.replace(/^\//, ''), normalizedBase).toString()
}

const rewriteS3EndpointForBrowser = (url: string) => {
  const endpoint = process.env.S3_ENDPOINT
  const publicBase = process.env.NEXT_PUBLIC_S3_PUBLIC_URL

  if (!endpoint || !publicBase || !/^https?:\/\//i.test(url)) return url

  try {
    const source = new URL(url)
    const endpointUrl = new URL(endpoint)

    if (source.origin !== endpointUrl.origin) return url

    const bucket = process.env.S3_BUCKET
    const publicUrl = new URL(publicBase)
    let keyPath = source.pathname

    if (bucket && publicUrl.pathname !== '/' && keyPath.startsWith(`/${bucket}/`)) {
      keyPath = keyPath.slice(bucket.length + 1)
    }

    return joinUrl(publicBase, `${keyPath}${source.search}`)
  } catch {
    return url
  }
}

/**
 * Normalize media URLs to work across environments.
 * - Preserves remote MinIO/S3 URLs for browser rendering
 * - Rewrites server-only S3 endpoints to NEXT_PUBLIC_S3_PUBLIC_URL when provided
 * - Appends cache tag as ?v=<timestamp>
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

  const rewrittenUrl = rewriteS3EndpointForBrowser(url)
  const isAbsolute = /^https?:\/\//i.test(rewrittenUrl)

  try {
    const u = isAbsolute ? new URL(rewrittenUrl) : new URL(rewrittenUrl, 'http://placeholder')

    if (cacheTag) {
      u.searchParams.set('v', cacheTag)
    }

    return isAbsolute ? u.toString() : `${u.pathname}${u.search}`
  } catch {
    const pathname = rewrittenUrl.startsWith('/') ? rewrittenUrl : `/${rewrittenUrl}`
    return cacheTag ? `${pathname}?v=${encodeURIComponent(cacheTag)}` : pathname
  }
}
