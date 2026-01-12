'use server'

import { Where, getPayload } from 'payload'

import payloadConfig from '@payload-config'

export async function deleteIndicatorSetData(indicatorSetId: string) {
  const payload = await getPayload({ config: payloadConfig })

  if (!indicatorSetId) {
    throw new Error('indicatorSetId is required for deletion')
  }

  // 1) flow-layouts (field: indicatorSetId)
  const flowLayoutsWhere: Where = {
    indicatorSetId: { equals: indicatorSetId },
  }

  const flowLayouts = await payload.delete({
    collection: 'flow-layouts',
    where: flowLayoutsWhere,
  })

  // 2) key-defs (field: indicatorSetId)
  const keyDefsWhere: Where = {
    indicatorSetId: { equals: indicatorSetId },
  }

  const keydefs = await payload.delete({
    collection: 'key-defs',
    where: keyDefsWhere,
  })

  // 3) indicators-cms (field: indicatorSet)
  const indicatorsWhere: Where = {
    indicatorSet: { equals: indicatorSetId },
  }

  const indicators = await payload.delete({
    collection: 'indicators-cms',
    where: indicatorsWhere,
  })

  // 4) (optional) delete the indicator-set doc itself
  // NOTE: This will only delete if your where matches and access allows it.
  const indicatorSets = await payload.delete({
    collection: 'indicator-sets',
    where: {
      id: { equals: indicatorSetId },
    },
  })

  return {
    flowLayouts,
    keydefs,
    indicators,
    indicatorSets,
  }
}
