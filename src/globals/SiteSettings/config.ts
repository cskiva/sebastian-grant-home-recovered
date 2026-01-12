import type { GlobalConfig } from 'payload'
import { revalidateSettings } from './hooks/revalidateSettings'

export const SiteSettings: GlobalConfig = {
	slug: 'siteSettings',
	access: {
		read: () => true,
	},
	fields: [
		{
			name: 'siteTitle',
			type: 'text',
			label: 'Site Title',
		},
		{
			name: 'siteDescription',
			type: 'textarea',
			label: 'Site Description',
		},
		{
			name: 'siteAuthor',
			type: 'text',
			label: 'Site Author',
		},
		{
			name: 'siteLogo',
			type: 'upload',
			relationTo: 'media',
		},
		{
			name: 'siteDevelopers',
			type: 'array',
			label: 'Site Developers',
			fields: [
				{
					name: 'name',
					type: 'text',
					label: 'Developer Name',
				},
				{
					name: 'link',
					type: 'text',
					label: 'Developer Homepage',
				},
			],
		},
	],
	hooks: {
		afterChange: [revalidateSettings],
	},
}
