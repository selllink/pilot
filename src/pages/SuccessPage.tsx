import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { SuccessModal } from '@/components/modals/SuccessModal'
import { Button } from '@/components/ui/Button'

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
      <div className="rounded-[2rem] border border-slate-200 bg-white p-4 text-slate-600">
        <p className="text-sm">No se encontró el link del listing. Crea uno nuevo desde la página principal.</p>
        <Button variant="ghost" className="mt-3" onClick={() => navigate('/')}>
          Ir a crear
        </Button>
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
