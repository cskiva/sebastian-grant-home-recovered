import type { Metadata } from 'next'
import { SiteSetting } from '@/payload-types'
import { getCachedGlobal } from './getGlobals'
import { getServerSideURL } from './getURL'

async function getDefaultOpenGraph(): Promise<Metadata['openGraph']> {
	const siteSettingsData: SiteSetting = await getCachedGlobal('siteSettings', 1)
	return {
		type: 'website',
		description: siteSettingsData.siteDescription ?? '',
		images: [
			{
				url: `${getServerSideURL()}/website-template-OG.webp`,
			},
		],
		siteName: siteSettingsData.siteTitle ?? '',
		title: siteSettingsData.siteTitle ?? '',
	}
}

export const mergeOpenGraph = async (
	og?: Metadata['openGraph'],
): Promise<Metadata['openGraph']> => {
	const defaultOpenGraph = await getDefaultOpenGraph()
	return {
		...defaultOpenGraph,
		...og,
		images: og?.images ? og.images : defaultOpenGraph?.images,
	}
}
