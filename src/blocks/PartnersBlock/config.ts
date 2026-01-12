import type { Block } from 'payload'

export const PartnersBlock: Block = {
  slug: 'partnersBlock',
  interfaceName: 'PartnersBlock',
  labels: { singular: 'Partners List', plural: 'Partners Lists' },
  fields: [
    {
      name: 'partners',
      type: 'array',
      required: true,
      labels: { singular: 'Partner', plural: 'Partners' },
      fields: [
        {
          name: 'partner',
          required: true,
          type: 'relationship',
          relationTo: 'partners',
        },
      ],
    },
  ],
}
