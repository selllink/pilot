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
    <div className="w-full rounded-[2rem] border border-slate-100 bg-white p-4 shadow-sm">
      {showTitle && (
        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest ml-0.5 mb-3 block">
          Fotos del producto (máx. {MAX_FILES})
        </label>
      )}
      <div className="grid grid-cols-3 gap-2">
        <label
          className={`col-span-2 flex h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-colors hover:border-slate-300 hover:bg-slate-100 ${mainUrl ? 'hidden' : ''}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ALLOWED_TYPES.join(',')}
            multiple
            className="hidden"
            onChange={handleSelect}
          />
          <svg className="h-8 w-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeWidth={2} strokeLinecap="round" d="M12 4v16m8-8H4" />
          </svg>
          <span className="mt-2 text-xs text-slate-400">Agregar fotos</span>
        </label>
        {mainUrl && (
          <div className="relative col-span-2 h-40 overflow-hidden rounded-2xl bg-slate-100">
            <img src={mainUrl} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              aria-label="Remove photo"
              className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white shadow hover:bg-red-600"
              onClick={() => remove(0)}
            >
              <span className="text-xs">×</span>
            </button>
          </div>
        )}
        <div className="flex flex-col gap-2 overflow-y-auto max-h-40">
          {thumbUrls.map((url, i) => (
            <div key={i} className="relative h-[76px] overflow-hidden rounded-xl bg-slate-100">
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                aria-label="Remove photo"
                className="absolute right-1 top-1 rounded-full bg-red-500 p-0.5 text-white hover:bg-red-600"
                onClick={() => remove(i + 1)}
              >
                <span className="text-[10px]">×</span>
              </button>
            </div>
          ))}
          {canAdd && (
            <label className="flex h-[76px] cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-2xl text-slate-300 transition-colors hover:border-slate-300 hover:bg-slate-100">
              <input
                ref={inputRef}
                type="file"
                accept={ALLOWED_TYPES.join(',')}
                multiple
                className="hidden"
                onChange={handleSelect}
              />
              +
            </label>
          )}
        </div>
      </div>
      {error && <p className="mt-2 text-[10px] text-red-500">{error}</p>}
    </div>
  )
}
