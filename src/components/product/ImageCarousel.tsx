import { useState, useCallback } from 'react'

interface ImageCarouselProps {
  imageUrls: string[]
  alt: string
  className?: string
}

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}

export function ImageCarousel({ imageUrls, alt, className = '' }: ImageCarouselProps) {
  const [index, setIndex] = useState(0)
  const length = imageUrls.length

  const goTo = useCallback(
    (i: number) => {
      setIndex(i < 0 ? length - 1 : i >= length ? 0 : i)
    },
    [length]
  )

  if (!imageUrls.length) {
    return (
      <div className={`flex aspect-square items-center justify-center rounded-3xl bg-slate-100 ${className}`}>
        <span className="text-sm text-slate-500">Sin imagen</span>
      </div>
    )
  }

  return (
    <div className={className}>
      <div
        className="relative aspect-square overflow-hidden touch-pan-y select-none"
        style={{ touchAction: 'pan-y' }}
      >
        <img
          src={imageUrls[index]}
          alt={`${alt} ${index + 1}`}
          className="h-full w-full object-cover"
          loading="lazy"
          draggable={false}
        />
        {length > 1 && (
          <>
            {/* Zona izquierda: imagen anterior */}
            <button
              type="button"
              aria-label="Imagen anterior"
              className="absolute inset-y-0 left-0 z-10 w-1/2 cursor-pointer"
              onClick={() => goTo(index - 1)}
            />
            {/* Zona derecha: siguiente imagen */}
            <button
              type="button"
              aria-label="Siguiente imagen"
              className="absolute inset-y-0 right-0 z-10 w-1/2 cursor-pointer"
              onClick={() => goTo(index + 1)}
            />
            {/* Iconos visibles */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 z-0 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md"
            >
              <ChevronLeft className="h-5 w-5" />
            </span>
            <span
              aria-hidden
              className="pointer-events-none absolute right-3 top-1/2 z-0 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md"
            >
              <ChevronRight className="h-5 w-5" />
            </span>
          </>
        )}
      </div>
      {length > 1 && (
        <div className="flex justify-center gap-2 pb-4 pt-4">
          {imageUrls.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir a imagen ${i + 1}`}
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                i === index ? 'scale-125 bg-cyan-500 ring-2 ring-cyan-500/30' : 'bg-slate-300 hover:bg-slate-400'
              }`}
              onClick={(e) => { e.stopPropagation(); setIndex(i) }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
