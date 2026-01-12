// utils/getIndicators.ts
import { getPayload } from 'payload'
import payloadConfig from '@payload-config'

export async function getIndicatorSets(limit = 9999) {
  const payload = await getPayload({ config: payloadConfig })
  const result = await payload.find({
    collection: 'indicator-sets',
    limit,
  })
  return result
}
