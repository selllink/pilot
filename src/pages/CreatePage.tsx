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

function LockIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  )
}

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
    <div className="mx-auto max-w-md space-y-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <ImageUploader
          files={files}
          previewUrls={previewUrls}
          onFilesChange={setFiles}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            card
            label="Título"
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
        </div>
        <Input
          card
          label="Descripción"
          placeholder="Describe tu producto"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="rounded-[2rem] border border-slate-100 bg-white p-4 shadow-sm focus-within:ring-2 focus-within:ring-cyan-400 focus-within:border-cyan-200">
          <WhatsAppNumberInput value={whatsappNumber} onChange={setWhatsappNumber} />
        </div>
        {!isCreatorGoogle && (
          <div className="rounded-[2rem] border border-slate-100 bg-white p-4 shadow-sm focus-within:ring-2 focus-within:ring-cyan-400 focus-within:border-cyan-200">
            <div className="flex items-center gap-2">
              <span className="text-slate-400" aria-hidden>
                <LockIcon />
              </span>
              <div className="flex-1 min-w-0">
                <Input
                  label="Tu email"
                  type="email"
                  placeholder="tú@ejemplo.com"
                  value={creatorEmail}
                  onChange={(e) => setCreatorEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <p className="mt-1 text-[10px] text-slate-400 uppercase tracking-tighter">
              Para editar después necesitarás iniciar sesión con Google.
            </p>
          </div>
        )}
        {error && <p className="text-[10px] text-red-500">{error}</p>}
        <div>
          <Button type="submit" variant="magic" disabled={submitting}>
            {submitting ? 'Generando…' : 'Generar Link Mágico ✨'}
          </Button>
          <p className="mt-4 text-center text-[10px] uppercase tracking-tighter text-slate-400">
            El link será válido por <span className="font-bold text-blue-500">30 días</span>.
            Requiere <span className="font-bold">SSO</span> para edición posterior.
          </p>
        </div>
      </form>
    </div>
  )
}
