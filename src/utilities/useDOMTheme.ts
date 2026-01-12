'use client'

import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

function getCurrentTheme(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
}

export function useDomTheme(): Theme {
  // IMPORTANT: do NOT read document during initial render
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const html = document.documentElement

    let raf = 0
    const sync = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        setTheme(getCurrentTheme())
      })
    }

    // initial sync (client-only)
    sync()

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'data-theme') {
          sync()
          break
        }
      }
    })

    observer.observe(html, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [])

  return theme
}
