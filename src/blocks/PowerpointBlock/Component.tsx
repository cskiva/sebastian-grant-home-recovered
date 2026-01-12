'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import RichText from '@/components/RichText'
import SlideSelectTile from './SlideSelectTile'

// ==== Types that mirror your Payload block shape ====
export type PowerpointSlideDoc = {
  id?: string | number
  title: string
  subtitle?: string
  body: DefaultTypedEditorState
  media?: any
}

export interface PowerpointBlockProps {
  name?: string
  slides?: PowerpointSlideDoc[]
  initialIndex?: number
  onChange?: (index: number) => void
  className?: string
}

export default function PowerpointBlock({
  slides,
  initialIndex = 0,
  onChange,
  className = '',
}: PowerpointBlockProps) {
  const [index, setIndex] = useState(() =>
    Math.min(Math.max(initialIndex, 0), slides?.length ?? -1),
  )
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    onChange?.(index)
  }, [index, onChange])

  const go = (delta: number) => setIndex((i) => clamp(i + delta, 0, slides?.length ?? -1))
  const select = (i: number) => setIndex(clamp(i, 0, slides?.length ?? -1))

  // Keyboard nav
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault()
        go(1)
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        go(-1)
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        select(index + 1)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        select(index - 1)
      }
    }
    el.addEventListener('keydown', onKey)
    return () => el.removeEventListener('keydown', onKey)
  }, [index, slides?.length])

  // Responsive sidebar toggle (mobile)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  useEffect(() => {
    setSidebarOpen(false)
  }, [index])

  if (!slides) return <>loading</>

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className={
        'relative mx-auto flex min-h-[70dvh] w-full max-w-6xl overflow-hidden rounded-2xl shadow-sm outline-none' +
        className
      }
      aria-label="Powerpoint slideshow"
      role="region"
    >
      {/* Sidebar */}
      <aside
        className={`
          w-72 flex-shrink-0 bg-secondary backdrop-blur border-r-2 border-foreground
          md:static md:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          transition-transform duration-200 ease-out
        `}
        aria-label="Slide navigation"
      >
        <nav className="p-2">
          <ol className="space-y-1">
            {slides.map((s, i) => (
              <SlideSelectTile
                key={s.id ?? i}
                currentIndex={index}
                slide={s}
                index={i}
                onSelect={(index: number) => select(index)}
              />
            ))}
          </ol>
        </nav>
      </aside>

      {/* Content */}
      <section className="relative ml-0 flex min-w-0 flex-1 flex-col bg-background rounded-tr-2xl dark:bg-black">
        <div className="relative flex-1 overflow-hidden pl-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="h-full"
            >
              <div className="prose max-w-none">
                <div>
                  <h3 className="text-2xl font-semibold leading-tight text-foreground">
                    {slides[index]?.title}
                  </h3>
                </div>
                <div>
                  {slides[index]?.subtitle && (
                    <p className="-mt-1 mb-6 text-md">{slides[index]?.subtitle}</p>
                  )}
                  {slides[index].body && (
                    <RichText
                      className="text-foreground"
                      enableGutter={false}
                      data={slides[index]?.body}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-3 border-t border-zinc-200 bg-background/70 p-3 backdrop-blur">
          <div className="text-xs text-zinc-500">
            Slide {index + 1} of {slides.length}
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => go(-1)}
              disabled={index === 0}
              className="rounded-xl border border-zinc-200 px-3 py-1.5 text-sm disabled:opacity-40"
            >
              Prev
            </Button>
            <Button
              onClick={() => go(1)}
              disabled={index === slides.length - 1}
              className="rounded-xl border border-zinc-200 px-3 py-1.5 text-sm disabled:opacity-40"
            >
              Next
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(n, max))
}
