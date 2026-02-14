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
    <span className={`font-mono text-2xl font-semibold text-slate-900 ${className}`}>
      {formatted}
    </span>
  )
}
