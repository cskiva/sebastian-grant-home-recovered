'use client'

import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

function getCurrentTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export function useDomTheme(): Theme {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const html = document.documentElement

    let raf = 0
    const sync = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setTheme(getCurrentTheme()))
    }

    sync()

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'class') {
          sync()
          break
        }
      }
    })

    observer.observe(html, { attributes: true, attributeFilter: ['class'] })

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [])

  return theme
}
