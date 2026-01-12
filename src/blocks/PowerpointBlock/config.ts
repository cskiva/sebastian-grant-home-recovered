import type { Block } from 'payload'

export const PowerpointBlock: Block = {
  slug: 'powerpointBlock',
  interfaceName: 'PowerpointBlock',
  imageURL: '/layout_icons/slideshow.svg',
  imageAltText: 'slideshow/powerpoint',
  labels: { singular: 'Powerpoint', plural: 'Powerpoints' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'initialIndex', type: 'number', min: 0, defaultValue: 0 },
    {
      name: 'slides',
      type: 'array',
      labels: { singular: 'Slide', plural: 'Slides' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'subtitle', type: 'text' },
        { name: 'body', type: 'richText' },
        // { name: 'media', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
