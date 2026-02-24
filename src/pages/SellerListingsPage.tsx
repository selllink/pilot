import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  getCreatorBySlug,
  getActiveListingsByCreatorEmail,
  getListingImageUrls,
} from '@/lib/listings'
import { Button } from '@/components/ui/Button'

export function SellerListingsPage() {
  const { creatorSlug } = useParams<{ creatorSlug: string }>()
  const navigate = useNavigate()

  const { data: creator, isLoading: creatorLoading, error: creatorError } = useQuery({
    queryKey: ['creator-by-slug', creatorSlug],
    queryFn: () => getCreatorBySlug(creatorSlug!),
    enabled: !!creatorSlug,
  })

  const { data: listings = [], isLoading: listingsLoading } = useQuery({
    queryKey: ['active-listings-by-creator', creator?.creator_email],
    queryFn: () => getActiveListingsByCreatorEmail(creator!.creator_email),
    enabled: !!creator?.creator_email,
  })

  if (creatorLoading || !creatorSlug) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-1/3 rounded-[2rem] bg-slate-200" />
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-square rounded-[2rem] bg-slate-200" />
          ))}
        </div>
      </div>
    )
  }

  if (creatorError || !creator) {
    return (
      <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
        <p className="text-slate-800">Este link no existe o ha expirado.</p>
        <Button variant="ghost" className="mt-3" onClick={() => navigate('/')}>
          Ir al inicio
        </Button>
      </div>
    )
  }

  const creatorName = listings[0]?.creator_name ?? 'Vendedor'

  return (
    <div className="pb-8">
      <h1 className="mb-4 text-lg font-bold text-slate-800">
        Publicaciones de {creatorName}
      </h1>
      {listingsLoading ? (
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-square animate-pulse rounded-[2rem] bg-slate-200" />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
          <p className="text-slate-600">No hay publicaciones activas en este momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {listings.map((listing) => {
            const imageUrls = getListingImageUrls(listing)
            return (
              <Link
                key={listing.id}
                to={`/v/${listing.short_slug}`}
                className="flex min-w-0 flex-col overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="aspect-square w-full overflow-hidden bg-slate-100">
                  {imageUrls[0] ? (
                    <img
                      src={imageUrls[0]}
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
                  <p className="truncate text-xs font-semibold text-slate-800">{listing.title}</p>
                  <p className="mt-0.5 truncate text-sm font-bold text-cyan-500">
                    $ {Number(listing.price).toLocaleString()}{' '}
                    <span className="uppercase">{listing.currency_code}</span>
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
