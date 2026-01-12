// utils/getIndicators.ts
import { Where, getPayload } from 'payload'

import payloadConfig from '@payload-config'

export async function getIndicators(indicatorSetId?: string, limit = 9999, depth = 1) {
  const payload = await getPayload({ config: payloadConfig })

  const where: Where = {
    ...(indicatorSetId && {
      indicatorSet: {
        equals: indicatorSetId,
      },
    }),
  }

  const result = await payload.find({
    collection: 'indicators-cms',
    where,
    depth,
    limit,
  })

  return result
}
