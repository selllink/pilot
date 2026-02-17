import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { SuccessModal } from '@/components/modals/SuccessModal'

/** URL para compartir (WhatsApp, copiar): usa /s/ para que el preview muestre título e imagen. */
function getShareUrl(slug: string): string {
  const base = typeof window !== 'undefined' ? window.location.origin : ''
  return `${base}/s/${slug}`
}

export function SuccessPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [listingUrl, setListingUrl] = useState<string | null>(null)

  const slug =
    (location.state as { slug?: string } | null)?.slug ??
    new URLSearchParams(location.search).get('slug')

  useEffect(() => {
    if (slug) {
      setListingUrl(getShareUrl(slug))
    }
  }, [slug])

  if (!slug) {
    return (
      <div className="rounded-lg bg-amber-50 p-4 text-amber-800">
        <p>No listing link found. Create a new listing from the home page.</p>
        <button
          type="button"
          className="mt-2 text-sm font-medium underline"
          onClick={() => navigate('/')}
        >
          Go to create
        </button>
      </div>
    )
  }

  if (!listingUrl) return null

  return (
    <SuccessModal
      listingUrl={listingUrl}
      onClose={() => navigate('/')}
    />
  )
}
