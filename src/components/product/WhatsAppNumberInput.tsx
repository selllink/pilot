import { Input } from '../ui/Input'

const E164_REGEX = /^\+?[1-9]\d{8,14}$/

export function normalizeWhatsAppNumber(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length === 0) return ''
  if (digits.startsWith('52') && digits.length >= 10) return digits
  if (digits.length >= 10) return '52' + digits
  return digits
}

export function validateWhatsAppNumber(value: string): string | null {
  const normalized = normalizeWhatsAppNumber(value)
  if (normalized.length < 10) return 'Enter a valid phone number with country code.'
  if (!E164_REGEX.test('+' + normalized)) return 'Invalid phone format (e.g. 5215512345678).'
  return null
}

interface WhatsAppNumberInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

export function WhatsAppNumberInput({ value, onChange, error }: WhatsAppNumberInputProps) {
  return (
    <Input
      type="tel"
      label="WhatsApp number"
      placeholder="5215512345678"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={error}
    />
  )
}
