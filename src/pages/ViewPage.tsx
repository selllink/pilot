import { useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getListingBySlug, getListingImageUrls, recordListingEvent } from '@/lib/listings'
import { ImageCarousel } from '@/components/product/ImageCarousel'
import { PriceTag } from '@/components/product/PriceTag'
import { Countdown } from '@/components/product/Countdown'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

const DEFAULT_MESSAGE = 'Hola, me interesa tu producto'

export function ViewPage() {
  const { shortSlug } = useParams<{ shortSlug: string }>()
  const navigate = useNavigate()
  const viewRecorded = useRef(false)

  const { data: listing, isLoading, error } = useQuery({
    queryKey: ['listing', shortSlug],
    queryFn: () => getListingBySlug(shortSlug!),
    enabled: !!shortSlug,
  })

  useEffect(() => {
    if (!listing?.id || viewRecorded.current) return
    viewRecorded.current = true
    recordListingEvent(listing.id, 'view').catch(() => {})
  }, [listing?.id])

  const handleWhatsAppClick = () => {
    if (!listing) return
    recordListingEvent(listing.id, 'whatsapp_click').catch(() => {})
    const shareUrl = `${window.location.origin}/s/${listing.short_slug}`
    const text = encodeURIComponent(
      `${DEFAULT_MESSAGE}: ${listing.title} - ${shareUrl}`
    )
    const url = `https://wa.me/${listing.whatsapp_number}?text=${text}`
    window.open(url, '_blank')
  }

  if (isLoading || !shortSlug) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="aspect-square rounded-xl bg-slate-200" />
        <div className="h-8 w-1/2 rounded bg-slate-200" />
        <div className="h-4 w-full rounded bg-slate-200" />
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-800">
        <p>This link does not exist or has expired.</p>
        <Button variant="ghost" className="mt-2" onClick={() => navigate('/')}>
          Go back
        </Button>
      </div>
    )
  }

  const imageUrls = getListingImageUrls(listing)
  const isExpired = new Date(listing.expires_at) <= new Date()

  return (
    <div className="pb-24">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <button
          type="button"
          className="text-sm font-medium text-slate-700"
          onClick={() => {
            navigator.share?.({
              title: listing.title,
              url: `${window.location.origin}/s/${listing.short_slug}`,
            }).catch(() => {
              navigator.clipboard.writeText(`${window.location.origin}/s/${listing.short_slug}`)
            })
          }}
        >
          Share
        </button>
      </div>

      <ImageCarousel imageUrls={imageUrls} alt={listing.title} className="mb-4" />

      <div className="space-y-2">
        <PriceTag price={listing.price} currencyCode={listing.currency_code} />
        <h1 className="text-xl font-semibold text-slate-900">{listing.title}</h1>
        {listing.description && (
          <p className="text-slate-600">{listing.description}</p>
        )}
        <div className="flex items-center gap-2">
          <Countdown expiresAt={listing.expires_at} />
          {isExpired && <Badge status="expired" />}
        </div>
      </div>

      {listing.creator_verified_google && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3">
          {listing.creator_avatar_url ? (
            <img
              src={listing.creator_avatar_url}
              alt=""
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-lg font-medium text-slate-500">
              {(listing.creator_name || 'V').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-slate-900">
              {listing.creator_name || 'Vendedor'}
            </p>
            <span className="inline-flex items-center gap-1.5 rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              Cuenta verificada con Google
            </span>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-slate-50 p-4">
        <Button
          variant="whatsapp"
          fullWidth
          onClick={handleWhatsAppClick}
          disabled={isExpired}
        >
          Contact on WhatsApp
        </Button>
      </div>
    </div>
  )
}
