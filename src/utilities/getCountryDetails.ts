import { CountryDetails } from '@/app/(frontend)/_providers/Map'

export default async function getCountryDetails(
  iso2: string,
  cacheRef: React.RefObject<Map<string, CountryDetails>>,
) {
  const key = iso2.toLowerCase()
  const cached = cacheRef.current.get(key)
  if (cached) return cached

  const res = await fetch(`/api/country/${key}`)
  if (!res.ok) return null
  const details = (await res.json()) as CountryDetails
  cacheRef.current.set(key, details)
  return details
}
