import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Partner, PartnersBlock as PartnersBlockProps } from 'src/payload-types'

import { Media } from '@/components/Media'
import React from 'react'

function isPartner(v: unknown): v is Partner {
  return !!v && typeof v === 'object' && 'name' in (v as any)
}

export const PartnersBlock: React.FC<PartnersBlockProps> = ({ partners }) => {
  const list = Array.isArray(partners) ? partners : []

  return (
    <div className="container my-16">
      <div className="grid grid-cols-3 lg:grid-cols-3 gap-y-8 gap-x-16">
        {list.map((item, i) => {
          const p = isPartner(item?.partner) ? item.partner : null
          if (!p) return null

          // Prefer stable keys:
          const key = item.id ?? p.id ?? `partner-${i}`

          return (
            <Card key={key} className="bg-transparent border-transparent shadow-none">
              <CardHeader>
                <CardTitle className="text-center">{p.name}</CardTitle>
              </CardHeader>
              <CardContent className="mt-auto flex">
                <div className="rounded-sm mx-auto">
                  <Media
                    className="-mx-4 md:-mx-8 2xl:-mx-16 dark:hidden"
                    imgClassName=""
                    priority
                    resource={p.logoDark}
                  />
                  <Media
                    className="-mx-4 md:-mx-8 2xl:-mx-16 hidden dark:block"
                    imgClassName=""
                    priority
                    resource={p.logoLight}
                  />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
