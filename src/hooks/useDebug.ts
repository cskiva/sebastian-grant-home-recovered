// utils.ts
import { useCallback } from 'react'

export function useDebug(scope = 'MatrixUploader') {
  const debug = useCallback(
    (msg: string, data?: unknown) => {
      if (process.env.NODE_ENV !== 'development') return

      const line = data
        ? `${msg}: ${(() => {
            try {
              return JSON.stringify(data)
            } catch {
              return '[unserializable]'
            }
          })()}`
        : msg

      console.debug(`[${scope}]`, line)
    },
    [scope],
  )

  return debug
}
