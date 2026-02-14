import { Link, useNavigate } from 'react-router-dom'
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
import { Countdown } from '@/components/product/Countdown'
import type { Listing } from '@/lib/types'

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
  const imageUrls = getListingImageUrls(listing)
  const isExpired = new Date(listing.expires_at) <= new Date()
  const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/v/${listing.short_slug}`

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex gap-3">
        {imageUrls[0] ? (
          <img
            src={imageUrls[0]}
            alt=""
            className="h-16 w-16 rounded-lg object-cover"
          />
        ) : (
          <div className="h-16 w-16 rounded-lg bg-slate-200" />
        )}
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-medium text-slate-900">{listing.title}</h3>
          <p className="text-sm text-slate-600">
            {listing.currency_code} {listing.price}
          </p>
          <Countdown expiresAt={listing.expires_at} />
          <div className="mt-1 flex items-center gap-2">
            <Badge status={isExpired ? 'expired' : 'active'} />
            <span className="text-xs text-slate-500">
              {viewCount} views · {whatsappClickCount} WhatsApp
            </span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          variant="secondary"
          className="text-xs"
          onClick={() => navigate(`/dashboard/edit/${listing.id}`)}
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          className="text-xs"
          onClick={() => navigate(`/v/${listing.short_slug}`)}
        >
          View
        </Button>
        <Button
          variant="ghost"
          className="text-xs"
          onClick={() => {
            navigator.clipboard.writeText(publicUrl)
          }}
        >
          Copy link
        </Button>
        <Button
          variant="ghost"
          className="text-xs"
          onClick={() => onDuplicate(listing)}
        >
          Duplicate
        </Button>
        <Button
          variant="ghost"
          className="text-xs text-red-600 hover:bg-red-50"
          onClick={() => onDelete(listing.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  )
}

export function DashboardPage() {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">My listings</h1>
        <div className="text-sm text-slate-600">{user.email}</div>
      </div>
      <Link to="/">
        <Button variant="secondary">Create new listing</Button>
      </Link>
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
