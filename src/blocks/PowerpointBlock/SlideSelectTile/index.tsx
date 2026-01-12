import React from 'react'
import { cn } from '@/utilities/ui'

interface SlideSelectTileProps {
  slide: any
  index: number
  currentIndex: number
  onSelect: (index: number) => void
}

export default function SlideSelectTile({
  slide: s,
  index: i,
  onSelect,
  currentIndex,
}: SlideSelectTileProps) {
  return (
    <li>
      <div
        onClick={() => onSelect(i)}
        className={cn(
          'group bg-background cursor-pointer backdrop-blur-sm  flex w-full items-start gap-2 rounded-xl border p-3 text-left transition',
          i === currentIndex ? 'border-blue-600' : 'border-transparent',
        )}
        aria-current={i === currentIndex ? 'true' : undefined}
      >
        <div
          className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${i === currentIndex ? 'bg-blue-600' : 'bg-zinc-300'}`}
        />
        <div className="min-w-0">
          <div className={`truncate text-sm font-medium`}>{s.title}</div>
          {s.subtitle && <div className="truncate text-xs text-zinc-500">{s.subtitle}</div>}
        </div>
      </div>
    </li>
  )
}
