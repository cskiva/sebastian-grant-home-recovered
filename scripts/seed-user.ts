import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const email = process.env.SEED_ADMIN_EMAIL!
const password = process.env.SEED_ADMIN_PASSWORD!

const payload = await getPayload({ config })

const existing = await payload.find({
  collection: 'users',
  where: { email: { equals: email } },
  limit: 1,
})

if (existing.docs.length > 0) {
  console.log(`User ${email} already exists — skipping.`)
  process.exit(0)
}

await payload.create({
  collection: 'users',
  data: {
    email,
    password,
    name: 'Sebastian Grant',
    isAdmin: true,
  },
})

console.log(`Created user ${email}`)
process.exit(0)
