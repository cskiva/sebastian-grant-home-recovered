import { Admins } from './collections/Admins'
import { Categories } from './collections/Categories'
import { Footer } from './globals/Footer/config'
import { Header } from './globals/Header/config'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { SiteSettings } from './globals/SiteSettings/config'
import { Users } from './collections/Users'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { getServerSideURL } from './utilities/getURL'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import path from 'path'
import { plugins } from './plugins'
import { s3Storage } from '@payloadcms/storage-s3'
import { createRequire } from 'module'
import type { SharpDependency } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const require = createRequire(import.meta.url)

let sharp: SharpDependency | undefined

try {
	sharp = require('sharp')
} catch {
	sharp = undefined
}

export default buildConfig({
	...(sharp ? { sharp } : {}),
	email: nodemailerAdapter({
		defaultFromAddress: process.env.SMTP_FROM || 'noreply@example.com',
		defaultFromName: 'sebweb',
		transportOptions: {
			host: process.env.SMTP_HOST,
			port: Number(process.env.SMTP_PORT) || 587,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS,
			},
			tls: { rejectUnauthorized: false },
		},
	}),
	admin: {
		// user: 'admins',
		user: Users.slug,
		livePreview: {
			breakpoints: [
				{
					label: 'Mobile',
					name: 'mobile',
					width: 375,
					height: 667,
				},
				{
					label: 'Tablet',
					name: 'tablet',
					width: 768,
					height: 1024,
				},
				{
					label: 'Desktop',
					name: 'desktop',
					width: 1440,
					height: 900,
				},
			],
		},
	},
	collections: [Users, Admins, Posts, Media, Pages, Categories],
	cors: [getServerSideURL()].filter(Boolean),
	globals: [SiteSettings, Header, Footer],
	editor: lexicalEditor({}),
	plugins: [
		...plugins,
		s3Storage({
			collections: {
				media: true,
			},
			bucket: process.env.S3_BUCKET!,
			config: {
				endpoint: process.env.S3_ENDPOINT!, // <-- MinIO
				forcePathStyle: true, // <-- MinIO (important)
				region: process.env.S3_REGION || 'us-east-1', // <-- required by SDK
				credentials: {
					accessKeyId: process.env.S3_ACCESS_KEY_ID!,
					secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
				},
			},
		}),
	],
	secret: process.env.PAYLOAD_SECRET || '',
	typescript: {
		outputFile: path.resolve(dirname, 'payload-types.ts'),
	},
	db: mongooseAdapter({
		url: process.env.DATABASE_URL || '',
	}),
})
