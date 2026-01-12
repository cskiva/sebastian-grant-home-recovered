// lib/getGlobal.ts (NO next/cache imports)
import type { Config } from 'src/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

type Global = keyof Config['globals']

export async function getGlobal(slug: Global, depth = 0) {
	if (process.env.SKIP_BUILD_DB === '1') {
		process.stderr.write(`[build] SKIP_BUILD_DB=1 → getGlobal(${slug}) returning stub\n`)
		return {} as any
	}

	const payload = await getPayload({ config: configPromise })
	return payload.findGlobal({ slug, depth })
}
