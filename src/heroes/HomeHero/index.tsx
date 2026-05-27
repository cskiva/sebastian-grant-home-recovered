'use client'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import type { Page } from '@/payload-types'
import React from 'react'
import RichText from '@/components/RichText'

export const HomeHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  return (
    <div className="grid min-h-[80vh] grid-cols-2 -mt-[3rem] flex items-center justify-center">
      <div className="select-none relative h-full">
        {media && typeof media === 'object' && (
          <Media imgClassName="object-cover h-full" fill priority resource={media} />
        )}
      </div>
      <div className="mb-8 z-10 relative flex items-center justify-center">
        <div className="max-w-[36.5rem] md:text-center">
          {richText && <RichText className="mb-6" data={richText} enableGutter={false} />}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex md:justify-center gap-4">
              {links.map(({ link }, i) => {
                return (
                  <li key={i}>
                    <CMSLink {...link} appearance={'default'} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
