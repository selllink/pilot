import { useState, useCallback } from 'react'
import { Button } from '../ui/Button'

interface SuccessModalProps {
  listingUrl: string
  onClose?: () => void
}

export function SuccessModal({ listingUrl, onClose }: SuccessModalProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(listingUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }, [listingUrl])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-slate-900">Link created</h2>
        <p className="mt-1 text-sm text-slate-600">Share this link to sell your product.</p>
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            readOnly
            value={listingUrl}
            className="flex-1 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700"
          />
          <Button variant="primary" onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
        {onClose && (
          <Button variant="ghost" className="mt-4 w-full" onClick={onClose}>
            Close
          </Button>
        )}
      </div>
    </div>
  )
}
