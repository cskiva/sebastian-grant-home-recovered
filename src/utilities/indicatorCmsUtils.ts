import { IndicatorsCm } from '@/payload-types'

const INDIVIDUAL_URL = '/api/indicators-cms'

export const listAllIndicators = async (): Promise<IndicatorsCm[]> => {
  const res = await fetch(`${INDIVIDUAL_URL}?limit=9999&depth=0`, { credentials: 'include' })
  if (!res.ok) return []
  const json = await res.json()
  return (json?.docs as IndicatorsCm[]) ?? []
}
