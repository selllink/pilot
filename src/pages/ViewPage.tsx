import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getListingBySlug, getListingImageUrls, getListingsByCreator, recordListingEvent } from '@/lib/listings'
import type { Listing } from '@/lib/types'
import { ImageCarousel } from '@/components/product/ImageCarousel'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

const DEFAULT_MESSAGE = 'Hola, me interesa tu producto'

interface OtherListingsCarouselProps {
  otherListings: Listing[]
  getListingImageUrls: (listing: { image_paths: string[] | null }) => string[]
}

const ITEMS_PER_PAGE = 3

function OtherListingsCarousel({ otherListings, getListingImageUrls }: OtherListingsCarouselProps) {
  const [pageIndex, setPageIndex] = useState(0)
  const totalPages = Math.ceil(otherListings.length / ITEMS_PER_PAGE)
  const visibleListings = otherListings.slice(
    pageIndex * ITEMS_PER_PAGE,
    pageIndex * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  )

  const goPrev = () => setPageIndex((i) => (i <= 0 ? totalPages - 1 : i - 1))
  const goNext = () => setPageIndex((i) => (i >= totalPages - 1 ? 0 : i + 1))

  return (
    <section className="mt-6" aria-label="Más de este vendedor">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          Más de este vendedor
        </h2>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Página anterior"
              className="rounded-full p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              onClick={goPrev}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-xs text-slate-400">
              {pageIndex + 1} / {totalPages}
            </span>
            <button
              type="button"
              aria-label="Página siguiente"
              className="rounded-full p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              onClick={goNext}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {visibleListings.map((other) => {
          const otherImages = getListingImageUrls(other)
          return (
            <Link
              key={other.id}
              to={`/v/${other.short_slug}`}
              className="flex min-w-0 flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="aspect-square w-full overflow-hidden bg-slate-100">
                {otherImages[0] ? (
                  <img
                    src={otherImages[0]}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-400">
                    Sin foto
                  </div>
                )}
              </div>
              <div className="min-w-0 p-2">
                <p className="truncate text-xs font-semibold text-[#0F172A]">{other.title}</p>
                <p className="mt-0.5 truncate text-sm font-bold text-cyan-500">
                  $ {Number(other.price).toLocaleString()} <span className="uppercase">{other.currency_code}</span>
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

function daysRemaining(expiresAt: string): number {
  const end = new Date(expiresAt).getTime()
  const now = Date.now()
  if (end - now <= 0) return 0
  return Math.ceil((end - now) / (24 * 60 * 60 * 1000))
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

export function ViewPage() {
  const { shortSlug } = useParams<{ shortSlug: string }>()
  const navigate = useNavigate()
  const viewRecorded = useRef(false)
  const [creatorAvatarError, setCreatorAvatarError] = useState(false)

  const { data: listing, isLoading, error } = useQuery({
    queryKey: ['listing', shortSlug],
    queryFn: () => getListingBySlug(shortSlug!),
    enabled: !!shortSlug,
  })

  const { data: otherListings = [] } = useQuery({
    queryKey: ['listings-by-creator', listing?.creator_email, listing?.id],
    queryFn: () => getListingsByCreator(listing!.creator_email, listing!.id, 9),
    enabled: !!listing?.creator_email && !!listing?.id,
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
        <div className="aspect-square rounded-[2rem] bg-slate-100" />
        <div className="h-8 w-1/2 rounded-[2rem] bg-slate-100" />
        <div className="h-4 w-full rounded-[2rem] bg-slate-100" />
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-[#0F172A]">Este link no existe o ha expirado.</p>
        <Button variant="ghost" className="mt-3" onClick={() => navigate('/')}>
          Volver
        </Button>
      </div>
    )
  }

  const imageUrls = getListingImageUrls(listing)
  const isExpired = new Date(listing.expires_at) <= new Date()
  const days = daysRemaining(listing.expires_at)

  return (
    <div className="pb-28">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          className="text-sm font-medium text-slate-600 hover:text-[#0F172A]"
          onClick={() => navigate(-1)}
        >
          Atrás
        </button>
        <button
          type="button"
          className="text-sm font-medium text-cyan-500 hover:text-cyan-600"
          onClick={() => {
            navigator.share?.({
              title: listing.title,
              url: `${window.location.origin}/s/${listing.short_slug}`,
            }).catch(() => {
              navigator.clipboard.writeText(`${window.location.origin}/s/${listing.short_slug}`)
            })
          }}
        >
          Compartir
        </button>
      </div>

      <div className="mb-6 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <ImageCarousel imageUrls={imageUrls} alt={listing.title} className="overflow-hidden rounded-[2rem]" />
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h1 className="truncate text-lg font-bold text-[#0F172A]">{listing.title}</h1>
          {isExpired && <Badge status="expired" className="shrink-0" />}
        </div>
        <p className="text-xl font-extrabold text-cyan-500 whitespace-nowrap tabular-nums">
          $ {Number(listing.price).toLocaleString()} <span className="uppercase">{listing.currency_code}</span>
        </p>
        <p className="mt-2 flex items-center gap-1 text-[10px] text-slate-400">
          <ClockIcon className="h-3 w-3 shrink-0" />
          {isExpired ? 'expirado' : `expira en ${days} día${days !== 1 ? 's' : ''}`}
        </p>
        {listing.description && (
          <p className="mt-4 text-slate-600">{listing.description}</p>
        )}
      </div>

      {listing.creator_verified_google && (
        <div className="mt-4 flex items-center gap-3 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
          {listing.creator_avatar_url && !creatorAvatarError ? (
            <img
              src={listing.creator_avatar_url}
              alt=""
              className="h-12 w-12 rounded-full object-cover"
              referrerPolicy="no-referrer"
              onError={() => setCreatorAvatarError(true)}
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-lg font-medium text-slate-500">
              {(listing.creator_name || 'V').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-[#0F172A]">
              {listing.creator_name || 'Vendedor'}
            </p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              Cuenta verificada con Google
            </span>
          </div>
        </div>
      )}

      {otherListings.length > 0 && (
        <OtherListingsCarousel otherListings={otherListings} getListingImageUrls={getListingImageUrls} />
      )}

      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-100 bg-white/95 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <Button
          variant="whatsapp"
          fullWidth
          className="rounded-2xl py-3 font-semibold"
          onClick={handleWhatsAppClick}
          disabled={isExpired}
        >
          Contactar por WhatsApp
        </Button>
      </div>
    </div>
  )
}
