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

  return (
    <div className="w-full">
      {showTitle && (
        <p className="mb-2 text-sm font-medium text-slate-700">Photos (up to {MAX_FILES})</p>
      )}
      <div className="flex flex-wrap gap-2">
        {previewUrls.map((url, i) => (
          <div key={i} className="relative">
            <img
              src={url}
              alt={`Preview ${i + 1}`}
              className="h-20 w-20 rounded-lg object-cover"
            />
            <button
              type="button"
              aria-label="Remove photo"
              className="absolute -right-1 -top-1 rounded-full bg-red-500 p-0.5 text-white hover:bg-red-600"
              onClick={() => remove(i)}
            >
              <span className="text-xs">×</span>
            </button>
          </div>
        ))}
        {files.length < MAX_FILES && (
          <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-slate-500 hover:border-indigo-400 hover:bg-indigo-50/50">
            <input
              ref={inputRef}
              type="file"
              accept={ALLOWED_TYPES.join(',')}
              multiple
              className="hidden"
              onChange={handleSelect}
            />
            <span className="text-2xl">+</span>
          </label>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}
