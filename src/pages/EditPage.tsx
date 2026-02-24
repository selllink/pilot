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
import { getLocaleCurrencyCode } from '@/lib/localeCurrency'

export function EditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user, loading: authLoading } = useAuth()
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [currencyCode, setCurrencyCode] = useState(() => getLocaleCurrencyCode())
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
    return <div className="text-sm text-slate-600">Cargando…</div>
  }

  if (!user || listing.creator_email !== user.email) {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-white p-4 text-slate-600">
        <p className="text-sm">Solo puedes editar tus propios listings.</p>
        <Button variant="ghost" className="mt-3" onClick={() => navigate('/dashboard')}>
          Volver al dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-xl font-bold text-[#0F172A]">Editar listing</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          card
          placeholder="¿Qué vendes?"
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
          card
          placeholder="Describe tu producto"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex items-center gap-0 overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white py-2 pl-5 pr-2 shadow-[0_0_0_2px_rgba(34,211,238,0.35)] transition-[box-shadow,border-color] focus-within:border-cyan-300 focus-within:shadow-[0_0_0_3px_rgba(34,211,238,0.55),0_0_18px_8px_rgba(34,211,238,0.28)]">
          <div className="min-w-0 flex-1">
            <WhatsAppNumberInput value={whatsappNumber} onChange={setWhatsappNumber} hideLabel />
          </div>
          <span className="shrink-0 rounded-xl bg-green-500 px-3 py-2 text-[10px] font-bold uppercase tracking-tight text-white">
            Protected by SSO
          </span>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Fotos (máx. 5)
          </p>
          <div className="flex flex-wrap gap-2">
            {existingUrls.map((url, i) => (
              <div key={keptExistingPaths[i]} className="relative">
                <img
                  src={url}
                  alt={`Foto ${i + 1}`}
                  className="h-20 w-20 rounded-2xl object-cover"
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
        {error && <p className="text-[10px] text-red-500">{error}</p>}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/dashboard')}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Guardando…' : 'Guardar'}
          </Button>
        </div>
      </form>
    </div>
  )
}
