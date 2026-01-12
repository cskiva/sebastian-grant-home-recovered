// export const dynamic = 'force-dynamic'
// export const revalidate = 0

import type { Config } from 'src/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type Global = keyof Config['globals']

async function getGlobal(slug: Global, depth = 0) {
	// if (process.env.SKIP_BUILD_DB === '1') {
	// 	process.stderr.write(`[build] SKIP_BUILD_DB=1 → getGlobal(${slug}) returning stub\n`)
	// 	return {} as any
	// }
	const payload = await getPayload({ config: configPromise })
	const global = await payload.findGlobal({
		slug,
		depth,
	})
	return global
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedGlobal = (slug: Global, depth = 0) =>
	unstable_cache(async () => getGlobal(slug, depth), [slug], {
		tags: [`global_${slug}`],
	})
