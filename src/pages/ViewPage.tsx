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
    const text = encodeURIComponent(
      `${DEFAULT_MESSAGE}: ${listing.title} - ${window.location.href}`
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
              url: window.location.href,
            }).catch(() => {
              navigator.clipboard.writeText(window.location.href)
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
