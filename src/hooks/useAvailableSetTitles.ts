// hooks/useAvailableSetTitles.ts
'use client'

import { useEffect, useState } from 'react'

import { listAllSets } from '@/utilities/indicatorSetUtils'

export function useAvailableSetTitles() {
  const [titles, setTitles] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const sets = await listAllSets()
        if (!mounted) return
        setTitles(sets.map((s) => s.title!).filter(Boolean))
      } catch (e) {
        if (mounted) setError('Failed to load sets')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  return { titles, loading, error }
}
