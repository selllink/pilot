import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ImageUploader } from '@/components/product/ImageUploader'
import { PriceInput } from '@/components/product/PriceInput'
import { WhatsAppNumberInput, normalizeWhatsAppNumber, validateWhatsAppNumber } from '@/components/product/WhatsAppNumberInput'
import { createListing } from '@/lib/listings'
import type { CreateListingPayload } from '@/lib/types'

function isGoogleUser(user: { app_metadata?: { provider?: string }; identities?: { provider: string }[] }): boolean {
  return user.app_metadata?.provider === 'google' || (user.identities?.some((i) => i.provider === 'google') ?? false)
}

export function CreatePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [currencyCode, setCurrencyCode] = useState('MXN')
  const [description, setDescription] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [creatorEmail, setCreatorEmail] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isCreatorGoogle = !!user && isGoogleUser(user)
  const creatorName = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? ''
  const creatorAvatarUrl = user?.user_metadata?.picture ?? user?.user_metadata?.avatar_url ?? null

  useEffect(() => {
    if (user?.email) setCreatorEmail(user.email)
  }, [user?.email])

  const previewUrls = useMemo(
    () => files.map((f) => URL.createObjectURL(f)),
    [files]
  )
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [previewUrls])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
    if (!creatorEmail.trim()) {
      setError('Email is required to manage your listing later.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(creatorEmail)) {
      setError('Enter a valid email.')
      return
    }

    setSubmitting(true)
    try {
      const payload: CreateListingPayload = {
        title: title.trim(),
        price: priceNum,
        currency_code: currencyCode,
        description: description.trim(),
        whatsapp_number: normalizedWhatsApp,
        creator_email: creatorEmail.trim(),
        ...(isCreatorGoogle && {
          creator_name: creatorName || null,
          creator_avatar_url: creatorAvatarUrl || null,
          creator_verified_google: true,
        }),
      }
      const listing = await createListing(payload, files)
      if (listing) {
        navigate('/create/success', { state: { slug: listing.short_slug } })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create listing.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">Create listing</h1>
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
        {isCreatorGoogle ? (
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            {creatorAvatarUrl && (
              <img
                src={creatorAvatarUrl}
                alt=""
                className="h-10 w-10 rounded-full object-cover"
              />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-700">
                Publicar como {creatorName || creatorEmail}
              </p>
              <p className="text-xs text-slate-500">{creatorEmail}</p>
            </div>
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
              Cuenta verificada con Google
            </span>
          </div>
        ) : (
          <Input
            label="Your email"
            type="email"
            placeholder="you@example.com"
            value={creatorEmail}
            onChange={(e) => setCreatorEmail(e.target.value)}
            required
          />
        )}
        <ImageUploader
          files={files}
          previewUrls={previewUrls}
          onFilesChange={setFiles}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" variant="primary" fullWidth disabled={submitting}>
          {submitting ? 'Creating…' : 'Create listing'}
        </Button>
      </form>
    </div>
  )
}
