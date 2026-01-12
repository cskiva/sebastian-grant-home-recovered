import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { Page, Post, SiteSetting } from '@/payload-types'

import { Plugin } from 'payload'
import { beforeSyncWithSearch } from '@/search/beforeSync'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getServerSideURL } from '@/utilities/getURL'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { searchFields } from '@/search/fieldOverrides'
import { searchPlugin } from '@payloadcms/plugin-search'
import { seoPlugin } from '@payloadcms/plugin-seo'

const generateTitle: GenerateTitle<Post | Page> = async ({ doc }) => {
	const siteSettingsData: SiteSetting = await getCachedGlobal('siteSettings', 1)()
	return doc?.title
		? `${doc.title} | ${siteSettingsData.siteTitle}`
		: siteSettingsData.siteTitle || ''
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
	const url = getServerSideURL()
	return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
	redirectsPlugin({
		collections: ['pages', 'posts'],
		overrides: {
			// @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
			fields: ({ defaultFields }) => {
				return defaultFields.map((field) => {
					if ('name' in field && field.name === 'from') {
						return {
							...field,
							admin: {
								description: 'You will need to rebuild the website when changing this field.',
							},
						}
					}
					return field
				})
			},
			hooks: {
				afterChange: [revalidateRedirects],
			},
		},
	}),
	nestedDocsPlugin({
		collections: ['categories'],
		generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
	}),
	seoPlugin({
		generateTitle,
		generateURL,
	}),
	formBuilderPlugin({
		fields: {
			payment: false,
		},
		formOverrides: {
			fields: ({ defaultFields }) => {
				// Clone default fields so we can modify
				const updatedFields = [...defaultFields]

				// Find the index of the title field
				const titleIndex = updatedFields.findIndex(
					(field) => 'name' in field && field.name === 'title',
				)

				// Insert the new subtitle field just after the title
				if (titleIndex !== -1) {
					updatedFields.splice(titleIndex + 1, 0, {
						name: 'subtitle',
						label: 'Subtitle',
						type: 'text',
						required: false,
						admin: {
							placeholder: 'Enter a short subtitle',
							description: 'Appears just below the form title.',
						},
					})
				}

				// Keep your existing confirmationMessage editor customization
				return updatedFields.map((field) => {
					if ('name' in field && field.name === 'confirmationMessage') {
						return {
							...field,
							editor: lexicalEditor({
								features: ({ rootFeatures }) => [
									...rootFeatures,
									FixedToolbarFeature(),
									HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
								],
							}),
						}
					}
					return field
				})
			},
			// hooks: {
			//   beforeRead: [
			//     ({ req }) => {
			//       // Never replace the object—just set the key
			//       if (!req.query) req.query = {}

			//       // Only set if not provided; use a STRING value
			//       if (typeof (req.query as any).depth === 'undefined') {
			//         ;(req.query as any).depth = '2' // not 2
			//       }

			//       // Important: return nothing (void). Don't return `req`.
			//     },
			//   ],
			// },
		},
	}),
	searchPlugin({
		collections: ['posts'],
		beforeSync: beforeSyncWithSearch,
		searchOverrides: {
			fields: ({ defaultFields }) => {
				return [...defaultFields, ...searchFields]
			},
		},
	}),
]
