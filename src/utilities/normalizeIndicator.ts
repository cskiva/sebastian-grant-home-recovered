export const normalize = (v?: unknown) =>
  String(v ?? '')
    .toLowerCase()
    .trim()

export const extractName = (d: any): string => {
  // 1️⃣ primaryKey is king
  if (d.primaryKey) return String(d.primaryKey)

  // 2️⃣ structured data payload
  if (d.data) {
    return (
      d.data.indicator ?? d.data.indicator_name ?? d.data.label ?? d.data.title ?? d.data.name ?? ''
    )
  }

  // 3️⃣ fallback: ids array
  if (Array.isArray(d.ids) && d.ids.length > 0) {
    return d.ids[0]?.id ?? ''
  }

  // 4️⃣ absolute fallback
  return d.id ?? 'unknown-indicator'
}

export const extractCountryCodes = (d: any): string[] => {
  const raw =
    d.data?.available_country_iso2 ??
    d.available_country_iso2 ??
    d.data?.countries ??
    d.data?.countryCodes ??
    []

  const arr = Array.isArray(raw)
    ? raw
    : String(raw)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

  // normalize to lowercase iso2
  return arr.map((c) => normalize(c))
}
