import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

import type { Post } from '../../../payload-types'

const revalidatePathIfAvailable = (path: string) => {
	try {
		revalidatePath(path)
	} catch (error) {
		if (
			error instanceof Error &&
			error.message.includes('static generation store missing')
		) {
			return
		}

		throw error
	}
}

const revalidateTagIfAvailable = (tag: string) => {
	try {
		revalidateTag(tag)
	} catch (error) {
		if (
			error instanceof Error &&
			error.message.includes('static generation store missing')
		) {
			return
		}

		throw error
	}
}

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
	doc,
	previousDoc,
	req: { payload, context },
}) => {
	if (!context.disableRevalidate) {
		if (doc._status === 'published') {
			const path = `/art/${doc.slug}`

			payload.logger.info(`Revalidating post at path: ${path}`)

			revalidatePathIfAvailable(path)
			revalidatePathIfAvailable('/art')
			revalidateTagIfAvailable('posts-sitemap')
		}

		// If the post was previously published, we need to revalidate the old path
		if (previousDoc._status === 'published' && doc._status !== 'published') {
			const oldPath = `/art/${previousDoc.slug}`

			payload.logger.info(`Revalidating old post at path: ${oldPath}`)

			revalidatePathIfAvailable(oldPath)
			revalidatePathIfAvailable('/art')
			revalidateTagIfAvailable('posts-sitemap')
		}
	}
	return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({ doc, req: { context } }) => {
	if (!context.disableRevalidate) {
		const path = `/art/${doc?.slug}`

		revalidatePathIfAvailable(path)
		revalidatePathIfAvailable('/art')
		revalidateTagIfAvailable('posts-sitemap')
	}

	return doc
}
