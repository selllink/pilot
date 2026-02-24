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
import { getLocaleCurrencyCode } from '@/lib/localeCurrency'

function LockIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  )
}

function StepCreaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  )
}

function StepComparteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  )
}

function StepVendeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
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
  const [currencyCode, setCurrencyCode] = useState(() => getLocaleCurrencyCode())
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
    <div className="mx-auto max-w-md">
      <section className="mb-5 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight leading-tight text-[#0F172A] sm:text-4xl">
          Tus ventas, a un <br />
          <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            solo link
          </span>{' '}
          de distancia.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          Diseñado para vendedores de redes sociales. Crea listings rápidos que tus clientes amarán.
        </p>
        <div className="mt-6 flex justify-center gap-6 text-sm font-bold uppercase tracking-widest text-slate-600">
          <span className="flex items-center gap-2">
            <span className="shrink-0 text-slate-600">
              <StepCreaIcon className="h-5 w-5" />
            </span>
            <span>1. Crea</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="shrink-0 text-slate-600">
              <StepComparteIcon className="h-5 w-5" />
            </span>
            <span>2. Comparte</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="shrink-0 text-slate-600">
              <StepVendeIcon className="h-5 w-5" />
            </span>
            <span>3. Vende</span>
          </span>
        </div>
        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-slate-100 px-4 py-3">
          <span className="shrink-0 text-slate-600">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <p className="text-xs font-medium text-slate-600">
            Links activos por <span className="font-bold text-slate-800">30 días</span>
            <span className="mx-1.5 text-slate-400">•</span>
            Edita con <span className="font-bold text-slate-800">SSO</span>
          </p>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          card
          placeholder="¿Qué vendes?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <ImageUploader
          files={files}
          previewUrls={previewUrls}
          onFilesChange={setFiles}
          showTitle={false}
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
        {!isCreatorGoogle && (
          <div className="rounded-[2rem] border border-slate-100 bg-white p-4 shadow-sm focus-within:ring-2 focus-within:ring-cyan-400 focus-within:border-cyan-200">
            <div className="flex items-center gap-2">
              <span className="text-slate-400" aria-hidden>
                <LockIcon />
              </span>
              <div className="min-w-0 flex-1">
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
            <p className="mt-1 text-[10px] uppercase tracking-tighter text-slate-400">
              Para editar después necesitarás iniciar sesión con Google.
            </p>
          </div>
        )}
        {error && <p className="text-[10px] text-red-500">{error}</p>}
        <div className="pt-4">
          <Button
            type="submit"
            variant="magic"
            disabled={submitting}
            className="py-5 text-[11px] font-extrabold uppercase tracking-[0.2em]"
          >
            {submitting ? 'Generando…' : 'Generar mi Link Mágico ✨'}
          </Button>
        </div>
        <p className="pt-4 text-center text-xs font-medium text-slate-500">
          Únete a +1000 vendedores que ya usan LinkVenta para sus historias.
        </p>
      </form>
    </div>
  )
}
