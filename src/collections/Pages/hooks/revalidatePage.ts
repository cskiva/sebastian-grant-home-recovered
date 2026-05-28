import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

import type { Page } from '../../../payload-types'

const tryRevalidate = (path: string) => {
	try {
		revalidatePath(path)
		revalidateTag('pages-sitemap')
	} catch {
		// no-op outside a Next.js request context (e.g. seed scripts)
	}
}

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
	doc,
	previousDoc,
	req: { payload, context },
}) => {
	if (!context.disableRevalidate) {
		if (doc._status === 'published') {
			const path = doc.slug === 'home' ? '/' : `/${doc.slug}`

			payload.logger.info(`Revalidating page at path: ${path}`)

			tryRevalidate(path)
		}

		// If the page was previously published, we need to revalidate the old path
		if (previousDoc?._status === 'published' && doc._status !== 'published') {
			const oldPath = previousDoc.slug === 'home' ? '/' : `/${previousDoc.slug}`

			payload.logger.info(`Revalidating old page at path: ${oldPath}`)

			tryRevalidate(oldPath)
		}
	}
	return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({ doc, req: { context } }) => {
	if (!context.disableRevalidate) {
		const path = doc?.slug === 'home' ? '/' : `/${doc?.slug}`
		tryRevalidate(path)
	}

	return doc
}
