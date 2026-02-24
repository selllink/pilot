import { useCallback, useRef } from 'react'

const MAX_FILES = 5
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

interface ImageUploaderProps {
  files: File[]
  previewUrls: string[]
  onFilesChange: (files: File[]) => void
  error?: string
  /** When false, the "Photos (up to N)" label is not rendered. Default true. */
  showTitle?: boolean
}

function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Only JPG, PNG and WEBP are allowed.'
  }
  if (file.size > MAX_SIZE_BYTES) {
    return 'File must be under 5MB.'
  }
  return null
}

export function ImageUploader({
  files,
  previewUrls,
  onFilesChange,
  error,
  showTitle = true,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = Array.from(e.target.files ?? [])
      const valid: File[] = []
      for (const file of selected) {
        const err = validateFile(file)
        if (err) {
          alert(err)
          continue
        }
        valid.push(file)
      }
      const next = [...files, ...valid].slice(0, MAX_FILES)
      onFilesChange(next)
      e.target.value = ''
    },
    [files, onFilesChange]
  )

  const remove = useCallback(
    (i: number) => {
      const next = files.filter((_, j) => j !== i)
      onFilesChange(next)
    },
    [files, onFilesChange]
  )

  const mainUrl = previewUrls[0]
  const thumbUrls = previewUrls.slice(1)
  const canAdd = files.length < MAX_FILES

  return (
    <div className="w-full rounded-[2.5rem] border border-slate-200 bg-white p-4 shadow-sm transition-[box-shadow,border-color] focus-within:border-cyan-200 focus-within:shadow-[0_0_0_2px_rgba(34,211,238,0.2)]">
      {showTitle && (
        <label className="mb-3 ml-0.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Fotos del Producto
        </label>
      )}
      <div className="grid grid-cols-3 gap-2">
        <label
          className={`group col-span-2 flex h-36 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/80 transition-all hover:border-cyan-200 hover:bg-cyan-50/50 ${mainUrl ? 'hidden' : ''}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ALLOWED_TYPES.join(',')}
            multiple
            className="hidden"
            onChange={handleSelect}
          />
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-transform group-hover:scale-105">
            <span className="text-lg font-bold text-cyan-600">+</span>
          </div>
          <span className="text-sm font-medium text-slate-600">Agrega fotos de tu producto</span>
          <span className="text-[11px] text-slate-400">Hasta {MAX_FILES} fotos · JPG, PNG o WebP · máx. 5 MB</span>
        </label>
        {mainUrl && (
          <div className="relative col-span-2 h-36 overflow-hidden rounded-3xl bg-slate-100 ring-1 ring-slate-100">
            <img src={mainUrl} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              aria-label="Quitar foto"
              className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-slate-700 shadow-sm transition-colors hover:bg-red-500 hover:text-white"
              onClick={() => remove(0)}
            >
              <span className="text-xs font-medium">×</span>
            </button>
          </div>
        )}
        <div className="flex max-h-36 flex-col gap-2 overflow-y-auto">
          {thumbUrls.map((url, i) => (
            <div key={i} className="relative h-[72px] overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-100">
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                aria-label="Quitar foto"
                className="absolute right-1 top-1 rounded-full bg-white/90 p-1 text-slate-600 shadow-sm transition-colors hover:bg-red-500 hover:text-white"
                onClick={() => remove(i + 1)}
              >
                <span className="text-[10px] font-medium">×</span>
              </button>
            </div>
          ))}
          {canAdd && (
            <label className="flex h-[72px] cursor-pointer flex-col items-center justify-center gap-0.5 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/80 text-slate-400 transition-all hover:border-cyan-200 hover:bg-cyan-50/50 hover:text-cyan-600">
              <input
                ref={inputRef}
                type="file"
                accept={ALLOWED_TYPES.join(',')}
                multiple
                className="hidden"
                onChange={handleSelect}
              />
              <span className="text-xl font-bold">+</span>
              <span className="text-[10px] font-medium">Agregar</span>
            </label>
          )}
        </div>
      </div>
      {error && <p className="mt-2 text-[10px] text-red-500">{error}</p>}
    </div>
  )
}
