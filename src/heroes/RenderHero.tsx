import { HighImpactHero } from '@/heroes/HighImpact'
import { HomeHero } from '@/heroes/HomeHero'
import { LowImpactHero } from '@/heroes/LowImpact'
import { MediumImpactHero } from '@/heroes/MediumImpact'
import type { Page } from '@/payload-types'
import React from 'react'

const heroes = {
  highImpact: HighImpactHero,
  lowImpact: LowImpactHero,
  mediumImpact: MediumImpactHero,
  homeHero: HomeHero,
}

export const RenderHero: React.FC<Page['hero']> = (props) => {
  const { type } = props || {}

  if (!type || type === 'none') return null

  const HeroToRender = heroes[type]

  if (!HeroToRender) return null

  return <HeroToRender {...props} />
}
