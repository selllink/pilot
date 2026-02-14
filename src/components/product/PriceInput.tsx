import { Input } from '../ui/Input'

const CURRENCIES = [
  { code: 'MXN', label: 'MXN' },
  { code: 'USD', label: 'USD' },
]

interface PriceInputProps {
  price: string
  currencyCode: string
  onPriceChange: (value: string) => void
  onCurrencyChange: (code: string) => void
  error?: string
}

export function PriceInput({
  price,
  currencyCode,
  onPriceChange,
  onCurrencyChange,
  error,
}: PriceInputProps) {
  return (
    <div className="flex gap-2">
      <div className="flex-1">
        <Input
          type="number"
          min={0}
          step="0.01"
          placeholder="0"
          value={price}
          onChange={(e) => onPriceChange(e.target.value)}
          error={error}
          label="Price"
        />
      </div>
      <div className="w-24">
        <label className="mb-1 block text-sm font-medium text-slate-700">Currency</label>
        <select
          value={currencyCode}
          onChange={(e) => onCurrencyChange(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
