import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'
import {
  getMyListings,
  getListingEventCounts,
  deleteListing,
  duplicateListing,
} from '@/lib/listings'
import { getListingImageUrls } from '@/lib/listings'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import type { Listing } from '@/lib/types'

function daysRemaining(expiresAt: string): number {
  const end = new Date(expiresAt).getTime()
  const now = Date.now()
  if (end - now <= 0) return 0
  return Math.ceil((end - now) / (24 * 60 * 60 * 1000))
}

function expirationColor(days: number): string {
  if (days <= 0) return 'text-red-500'
  if (days <= 6) return 'text-amber-600'
  if (days <= 14) return 'text-slate-600'
  return 'text-emerald-600'
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  )
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  )
}

function DuplicateIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  )
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )
}

function DotsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
    </svg>
  )
}

function ListingCard({
  listing,
  viewCount,
  whatsappClickCount,
  onDelete,
  onDuplicate,
}: {
  listing: Listing
  viewCount: number
  whatsappClickCount: number
  onDelete: (id: string) => void
  onDuplicate: (listing: Listing) => void
}) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const imageUrls = getListingImageUrls(listing)
  const isExpired = new Date(listing.expires_at) <= new Date()
  const days = daysRemaining(listing.expires_at)
  const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/s/${listing.short_slug}`

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpen])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl)
    setMenuOpen(false)
  }

  const progressPercent = isExpired ? 0 : Math.min(100, (days / 30) * 100)

  return (
    <div className="relative flex items-center gap-4 rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className="absolute right-5 top-5 flex flex-col items-end gap-1.5">
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-slate-500">
          {viewCount} views · {whatsappClickCount} WhatsApp
        </span>
        <Badge status={isExpired ? 'expired' : 'active'} className="shrink-0" />
      </div>
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-100">
        {imageUrls[0] ? (
          <img src={imageUrls[0]} alt="" className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div className="min-w-0 flex-1 pr-24">
        <h3 className="truncate text-lg font-bold text-slate-800">{listing.title}</h3>
        <p className="mt-0.5 text-xl font-extrabold text-blue-600">
          $ {Number(listing.price).toLocaleString()}{' '}
          <span className="text-xs font-medium uppercase text-slate-400">{listing.currency_code}</span>
        </p>
        <div className="mt-2">
          <p className={`flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider ${expirationColor(days)}`}>
            <ClockIcon className="h-4 w-4 shrink-0" />
            {isExpired ? 'Expirado' : `Expira en ${days} día${days !== 1 ? 's' : ''}`}
          </p>
          <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all ${
                days <= 0 ? 'bg-red-400' : days <= 6 ? 'bg-amber-500' : days <= 14 ? 'bg-slate-400' : 'bg-emerald-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={handleCopyLink}
          className="relative rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 p-2.5 text-white shadow-md shadow-cyan-500/20 transition hover:shadow-lg hover:shadow-cyan-500/30"
          aria-label="Copiar link"
        >
          <CopyIcon className="h-5 w-5" />
        </button>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-xl bg-slate-50 p-2.5 text-slate-500 transition hover:bg-slate-100"
            aria-label="Más opciones"
          >
            <DotsIcon className="h-5 w-5" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full z-10 mt-1 min-w-[140px] rounded-xl border border-slate-100 bg-white py-1 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  navigate(`/dashboard/edit/${listing.id}`)
                  setMenuOpen(false)
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                <PencilIcon className="h-4 w-4" /> Editar
              </button>
              <button
                type="button"
                onClick={() => {
                  navigate(`/v/${listing.short_slug}`)
                  setMenuOpen(false)
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                <CopyIcon className="h-4 w-4" /> Ver
              </button>
              <button
                type="button"
                onClick={() => {
                  onDuplicate(listing)
                  setMenuOpen(false)
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                <DuplicateIcon className="h-4 w-4" /> Duplicar
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete(listing.id)
                  setMenuOpen(false)
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                <TrashIcon className="h-4 w-4" /> Eliminar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function DashboardPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user, loading: authLoading, signInWithGoogle } = useAuth()
  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['my-listings', user?.email],
    queryFn: () => getMyListings(user!.email!),
    enabled: !!user?.email,
  })

  const listingIds = listings.map((l) => l.id)
  const { data: counts = {} } = useQuery({
    queryKey: ['listing-counts', listingIds.join(',')],
    queryFn: () => getListingEventCounts(listingIds),
    enabled: listingIds.length > 0,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteListing,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-listings'] }),
  })
  const duplicateMutation = useMutation({
    mutationFn: duplicateListing,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-listings'] }),
  })

  if (authLoading) {
    return <div className="text-slate-600">Loading…</div>
  }

  if (!user) {
    return (
      <div className="rounded-lg bg-slate-100 p-4 text-slate-700">
        <p className="font-medium">Sign in to manage your listings</p>
        <p className="mt-1 text-sm">Use the same email you used when creating listings.</p>
        <Button variant="primary" className="mt-3" onClick={signInWithGoogle}>
          Sign in with Google
        </Button>
      </div>
    )
  }

  const avatarUrl = (user.user_metadata?.picture as string) ?? (user.user_metadata?.avatar_url as string)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-[#0F172A]">My listings</h1>
        <div className="flex items-center gap-2 rounded-full border border-slate-100 bg-white px-3 py-1.5 shadow-sm">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-sm font-medium text-slate-600">
              {user.email?.charAt(0).toUpperCase() ?? '?'}
            </span>
          )}
          <span className="max-w-[140px] truncate text-sm text-slate-600">{user.email}</span>
        </div>
      </div>
      <Button type="button" variant="magic" onClick={() => navigate('/')}>
        Create new listing ✨
      </Button>
      {isLoading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <p className="text-slate-600">You have no listings yet. Create one to get started.</p>
      ) : (
        <div className="space-y-3">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              viewCount={counts[listing.id]?.views ?? 0}
              whatsappClickCount={counts[listing.id]?.whatsapp_clicks ?? 0}
              onDelete={(id) => {
                if (confirm('Delete this listing?')) deleteMutation.mutate(id)
              }}
              onDuplicate={(l) => duplicateMutation.mutate(l)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
