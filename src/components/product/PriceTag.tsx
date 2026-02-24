interface PriceTagProps {
  price: number
  currencyCode: string
  className?: string
}

const defaultLocale = 'es-MX'

export function PriceTag({ price, currencyCode, className = '' }: PriceTagProps) {
  const formatted = new Intl.NumberFormat(defaultLocale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price)
  return (
    <span className={`tabular-nums text-2xl font-bold text-[#0F172A] ${className}`}>
      {formatted}
    </span>
  )
}
