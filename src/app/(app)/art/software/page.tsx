import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heroes/RenderHero'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'

export const metadata: Metadata = {
  title: 'Software | Sebastian Grant',
}

export default async function SoftwarePage() {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    overrideAccess: draft,
    where: { slug: { equals: 'software' } },
  })

  const page = result.docs?.[0] ?? null

  if (!page) {
    return (
      <div className="min-h-[calc(100vh-104px)] px-4 py-6">
        <p className="text-muted-foreground">Software page not found. Run the seed script.</p>
      </div>
    )
  }

  return (
    <article className="pt-12 pb-24">
      <RenderHero {...page.hero} />
      <RenderBlocks blocks={page.layout} />
    </article>
  )
}
