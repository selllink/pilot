import { useState, useCallback } from 'react'

interface ImageCarouselProps {
  imageUrls: string[]
  alt: string
  className?: string
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
      <div className={`aspect-square bg-slate-200 rounded-xl flex items-center justify-center ${className}`}>
        <span className="text-slate-500">No image</span>
      </div>
    )
  }

  return (
    <div className={`overflow-hidden rounded-xl ${className}`}>
      <div
        className="relative aspect-square touch-pan-y select-none"
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
            <button
              type="button"
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50"
              onClick={() => goTo(index - 1)}
            />
            <button
              type="button"
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50"
              onClick={() => goTo(index + 1)}
            />
          </>
        )}
      </div>
      {length > 1 && (
        <div className="mt-2 flex justify-center gap-1.5">
          {imageUrls.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to image ${i + 1}`}
              className={`h-2 w-2 rounded-full transition ${i === index ? 'bg-indigo-600 scale-125' : 'bg-slate-300'}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
