import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

type LexicalNode = Record<string, unknown>

const heading = (text: string, tag: 'h1' | 'h2' | 'h3'): LexicalNode => ({
  type: 'heading',
  tag,
  children: [{ type: 'text', text, version: 1 }],
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})

const paragraph = (text: string): LexicalNode => ({
  type: 'paragraph',
  children: [{ type: 'text', text, version: 1 }],
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})

const richText = (nodes: LexicalNode[]) => ({
  root: {
    type: 'root',
    children: nodes,
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
})

const softwareContent = richText([
  heading('Lead Designer — Write In Stone', 'h3'),
  paragraph(
    'Design leadership at Write In Stone. Responsible for end-to-end product design — from research and wireframing through to production-ready UI and design systems.',
  ),
  heading('Developer — Young and Resilient Research Center', 'h3'),
  paragraph(
    'Full-stack development at the Young and Resilient Research Center, Western Sydney University. Building platforms and tools that support youth resilience research and community engagement.',
  ),
])

const outdoorContent = richText([
  heading('Pottsville Turf Farm — Labourer', 'h3'),
  paragraph(
    'Physical land work at Pottsville Turf Farm, including cultivation, harvesting, and maintenance of turf grass production.',
  ),
  heading('Construction and Carpentry', 'h3'),
  paragraph(
    'Hands-on construction and carpentry work across residential and commercial projects.',
  ),
  heading('33 Fruits Organics — Farmhand', 'h3'),
  paragraph(
    'Farmhand and horticulture/forestry work at 33 Fruits Organics, supporting organic growing practices and land stewardship.',
  ),
])

async function seed() {
  const payload = await getPayload({ config: configPromise })

  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { in: ['software', 'outdoor'] } },
    limit: 10,
    overrideAccess: true,
  })

  const existingSlugs = new Set(existing.docs.map((d) => d.slug))

  if (!existingSlugs.has('software')) {
    await payload.create({
      collection: 'pages',
      data: {
        title: 'Software',
        slug: 'software',
        _status: 'published',
        hero: {
          type: 'lowImpact',
          richText: richText([heading('Software', 'h1')]),
        },
        layout: [
          {
            blockType: 'content',
            columns: [{ size: 'full', richText: softwareContent }],
          },
        ],
      },
    })
    console.log('✓ Created software page')
  } else {
    console.log('— software page already exists, skipping')
  }

  if (!existingSlugs.has('outdoor')) {
    await payload.create({
      collection: 'pages',
      data: {
        title: 'Outdoor',
        slug: 'outdoor',
        _status: 'published',
        hero: {
          type: 'lowImpact',
          richText: richText([heading('Outdoor', 'h1')]),
        },
        layout: [
          {
            blockType: 'content',
            columns: [{ size: 'full', richText: outdoorContent }],
          },
        ],
      },
    })
    console.log('✓ Created outdoor page')
  } else {
    console.log('— outdoor page already exists, skipping')
  }

  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
