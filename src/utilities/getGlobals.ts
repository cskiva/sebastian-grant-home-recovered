import type { Config, Footer, SiteSetting } from '@/payload-types' // Adjusted import path

import { cache } from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type Global = keyof Config['globals']

// Helper to map slugs to their generated types
type GlobalType<T extends Global> = T extends 'footer'
	? Footer
	: T extends 'siteSettings'
	? SiteSetting
	: any

async function getGlobal<T extends Global>(slug: T, depth = 0): Promise<GlobalType<T>> {
	if (process.env.SKIP_BUILD_DB === '1') {
		return {} as GlobalType<T>
	}

	try {
		const payload = await getPayload({ config: configPromise })
		const global = await payload.findGlobal({
			slug,
			depth,
		})
		return global as unknown as GlobalType<T>
	} catch (error) {
		console.error(`Error fetching global "${slug}":`, error)
		return {} as GlobalType<T>
	}
}

/**
 * Modern Next.js 16 Pattern
 * Removed the extra execution wrapper inside cache to fix the "not callable" error.
 */
export const getCachedGlobal = cache(async <T extends Global>(slug: T, depth = 0): Promise<GlobalType<T>> => {
	// Use a unique key for the data cache
	const fetcher = unstable_cache(
		async () => getGlobal(slug, depth),
		['global', slug, depth.toString()],
		{
			tags: [`global_${slug}`],
		}
	)

	// Execute the cached function
	return fetcher()
})