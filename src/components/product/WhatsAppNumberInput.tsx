import { Input } from '../ui/Input'

const E164_REGEX = /^\+?[1-9]\d{8,14}$/

/** Normaliza a solo dígitos; no asume código de país. El usuario debe incluir código (ej. 52 México, 1 USA). */
export function normalizeWhatsAppNumber(value: string): string {
  return value.replace(/\D/g, '')
}

export function validateWhatsAppNumber(value: string): string | null {
  const normalized = normalizeWhatsAppNumber(value)
  if (normalized.length < 10) return 'Enter a valid phone number with country code (e.g. 5215512345678 for Mexico, 15551234567 for USA).'
  if (!E164_REGEX.test('+' + normalized)) return 'Invalid format. Use digits only with country code: 52 Mexico, 1 USA, 54 Argentina, etc.'
  return null
}

interface WhatsAppNumberInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
  /** Cuando true, no se muestra el label (útil si el padre renderiza su propia fila de label). */
  hideLabel?: boolean
}

export function WhatsAppNumberInput({ value, onChange, error, hideLabel }: WhatsAppNumberInputProps) {
  return (
    <Input
      type="tel"
      label={hideLabel ? undefined : 'Número WhatsApp'}
      placeholder="WhatsApp number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={error}
    />
  )
}
