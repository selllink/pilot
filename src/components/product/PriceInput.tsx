import { useMemo } from 'react'
import { getLocaleCurrencies } from '@/lib/localeCurrency'

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
  const currencies = useMemo(() => {
    const list = getLocaleCurrencies()
    const hasCurrent = list.some((c) => c.code === currencyCode)
    if (hasCurrent) return list
    return [{ code: currencyCode, label: currencyCode }, ...list]
  }, [currencyCode])
  return (
    <div
      className={`rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm transition-all focus-within:ring-2 focus-within:ring-cyan-400 focus-within:border-cyan-300 ${error ? 'border-red-200 focus-within:ring-red-200' : ''}`}
    >
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={0}
          step="0.01"
          placeholder="0"
          value={price}
          onChange={(e) => onPriceChange(e.target.value)}
          className="w-full min-w-0 flex-1 bg-transparent text-base font-bold tabular-nums text-[#0F172A] outline-none placeholder:text-slate-400"
        />
        <select
          value={currencyCode}
          onChange={(e) => onCurrencyChange(e.target.value)}
          className="rounded-xl border-0 bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 outline-none cursor-pointer hover:bg-slate-200/80 transition-colors"
        >
          {currencies.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="mt-1 text-[10px] text-red-500">{error}</p>}
    </div>
  )
}
