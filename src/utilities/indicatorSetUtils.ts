import { IndicatorSet, KeyDef } from '@/payload-types'
import { PaginatedDocs, Where } from 'payload'

// Adjust if your collection slug is 'indicator-sets'
const SETS_BASE = '/api/indicator-sets'

// --- LIST all sets (titles for the dropdown) ---
export async function listAllSets(limit = 1000): Promise<IndicatorSet[]> {
  const res = await fetch(`${SETS_BASE}?limit=${limit}&depth=0`, { credentials: 'include' })
  if (!res.ok) return []
  const json = await res.json()
  return (json?.docs ?? []) as IndicatorSet[]
}

// --- Find set by title ---
export async function findSetByTitle(title: string) {
  const res = await fetch(
    `${SETS_BASE}?where[title][equals]=${encodeURIComponent(title)}&limit=1&depth=0`,
    { credentials: 'include' },
  )
  if (!res.ok) return undefined
  const json = await res.json()
  return (json?.docs?.[0] as IndicatorSet) ?? undefined
}

export async function findSetByFirstIndicator(indicatorId: string) {
  const query: Where = {
    indicators: {
      contains: indicatorId,
    },
  }
  const url = `${SETS_BASE}?${query}`

  const res = await fetch(url, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  })

  let data: PaginatedDocs<IndicatorSet> | null = null
  try {
    data = await res.json()
  } catch (e) {
    // response had no/invalid JSON; fall through to error handling
    console.log('no indicator set found from first indicator')
  }

  console.log('finding', data)

  if (!res.ok) {
    // Optional: surface more context when debugging
    console.warn('findSetByFirstIndicator failed', res.status, data)
    return undefined
  }

  const singleSet = data?.docs[0]

  return singleSet
}

async function createSet(payload: Partial<IndicatorSet>) {
  const res = await fetch(SETS_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Failed to create indicator set (${res.status}): ${body}`)
  }
  return await res.json()
}

async function updateSet(id: string, payload: Partial<IndicatorSet>) {
  const res = await fetch(`${SETS_BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Failed to update indicator set (${res.status}): ${body}`)
  }
  return await res.json()
}

export async function saveSet(
  selected: string | undefined,
  indicatorCmsIds: string[],
  keyDefs: KeyDef[],
  available: string[],
  setAvailable: (x: string[] | ((prev: string[]) => string[])) => void,

  globalTrueDelim: string,
  globalFalseDelim: string,
): Promise<string> {
  // 👈 return the set id
  const name = selected || prompt('Name this indicator set:') || 'default'
  const existing = await findSetByTitle(name)

  const payload: Partial<IndicatorSet> = {
    title: name,
    booleanTrueDelim: globalTrueDelim,
    booleanFalseDelim: globalFalseDelim,
    indicators: indicatorCmsIds,
    keyDefs,
  }

  if (!existing) {
    const created = await createSet(payload) // returns IndicatorSet
    if (!available.includes(name)) setAvailable([...available, name])
    alert('Saved ✅')
    return created.doc.id
  }

  const updated = await updateSet(existing.id, payload)
  alert('Saved ✅')
  return updated.doc.id
}
