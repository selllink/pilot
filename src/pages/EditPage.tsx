import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'
import {
  getListingById,
  updateListing,
  getListingImageUrls,
  uploadImageFiles,
  deleteListingImages,
} from '@/lib/listings'
import type { UpdateListingPayload } from '@/lib/listings'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PriceInput } from '@/components/product/PriceInput'
import { ImageUploader } from '@/components/product/ImageUploader'
import {
  WhatsAppNumberInput,
  normalizeWhatsAppNumber,
  validateWhatsAppNumber,
} from '@/components/product/WhatsAppNumberInput'

export function EditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user, loading: authLoading } = useAuth()
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [currencyCode, setCurrencyCode] = useState('MXN')
  const [description, setDescription] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [keptExistingPaths, setKeptExistingPaths] = useState<string[]>([])
  const [newImageFiles, setNewImageFiles] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data: listing, isLoading } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => getListingById(id!),
    enabled: !!id,
  })

  useEffect(() => {
    if (listing) {
      setTitle(listing.title)
      setPrice(String(listing.price))
      setCurrencyCode(listing.currency_code)
      setDescription(listing.description ?? '')
      setWhatsappNumber(listing.whatsapp_number)
      setKeptExistingPaths(listing.image_paths ?? [])
    }
  }, [listing])

  const existingUrls = useMemo(
    () => getListingImageUrls({ image_paths: keptExistingPaths }),
    [keptExistingPaths]
  )
  const newPreviewUrls = useMemo(
    () => newImageFiles.map((f) => URL.createObjectURL(f)),
    [newImageFiles]
  )
  useEffect(() => {
    return () => newPreviewUrls.forEach((url) => URL.revokeObjectURL(url))
  }, [newPreviewUrls])

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/dashboard')
    }
  }, [authLoading, user, navigate])

  const updateMutation = useMutation({
    mutationFn: (updates: Parameters<typeof updateListing>[1]) =>
      updateListing(id!, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listing', id] })
      queryClient.invalidateQueries({ queryKey: ['my-listings'] })
      navigate('/dashboard')
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!listing) return
    setError(null)
    const normalizedWhatsApp = normalizeWhatsAppNumber(whatsappNumber)
    const whatsappErr = validateWhatsAppNumber(whatsappNumber)
    if (!title.trim()) {
      setError('Title is required.')
      return
    }
    const priceNum = parseFloat(price)
    if (Number.isNaN(priceNum) || priceNum < 0) {
      setError('Enter a valid price.')
      return
    }
    if (whatsappErr) {
      setError(whatsappErr)
      return
    }
    setSubmitting(true)
    try {
      const newPaths = await uploadImageFiles(newImageFiles)
      const removedPaths = (listing.image_paths ?? []).filter(
        (p) => !keptExistingPaths.includes(p)
      )
      if (removedPaths.length > 0) {
        await deleteListingImages(removedPaths)
      }
      const imagePaths = [...keptExistingPaths, ...newPaths]
      const payload: UpdateListingPayload = {
        title: title.trim(),
        price: priceNum,
        currency_code: currencyCode,
        description: description.trim() || undefined,
        whatsapp_number: normalizedWhatsApp,
        image_paths: imagePaths.length > 0 ? imagePaths : null,
      }
      await updateMutation.mutateAsync(payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!authLoading && !user) {
    return null
  }

  if (isLoading || !listing) {
    return <div className="text-slate-600">Loading…</div>
  }

  if (!user || listing.creator_email !== user.email) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-800">
        You can only edit your own listings.
        <Button variant="ghost" className="mt-2" onClick={() => navigate('/dashboard')}>
          Back to dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">Edit listing</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Title"
          placeholder="Product title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <PriceInput
          price={price}
          currencyCode={currencyCode}
          onPriceChange={setPrice}
          onCurrencyChange={setCurrencyCode}
        />
        <Input
          label="Description"
          placeholder="Describe your product"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <WhatsAppNumberInput
          value={whatsappNumber}
          onChange={setWhatsappNumber}
        />
        <div className="w-full">
          <p className="mb-2 text-sm font-medium text-slate-700">
            Photos (up to 5)
          </p>
          <div className="flex flex-wrap gap-2">
            {existingUrls.map((url, i) => (
              <div key={keptExistingPaths[i]} className="relative">
                <img
                  src={url}
                  alt={`Photo ${i + 1}`}
                  className="h-20 w-20 rounded-lg object-cover"
                />
                <button
                  type="button"
                  aria-label="Remove photo"
                  className="absolute -right-1 -top-1 rounded-full bg-red-500 p-0.5 text-white hover:bg-red-600"
                  onClick={() =>
                    setKeptExistingPaths((prev) =>
                      prev.filter((_, j) => j !== i)
                    )
                  }
                >
                  <span className="text-xs">×</span>
                </button>
              </div>
            ))}
          </div>
          {keptExistingPaths.length + newImageFiles.length < 5 && (
            <ImageUploader
              files={newImageFiles}
              previewUrls={newPreviewUrls}
              onFilesChange={(files) => {
                const total = keptExistingPaths.length + files.length
                if (total <= 5) setNewImageFiles(files)
                else setNewImageFiles(files.slice(0, 5 - keptExistingPaths.length))
              }}
              showTitle={false}
            />
          )}
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  )
}
