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
    <div
      className={`rounded-[2rem] border border-slate-100 bg-white p-4 shadow-sm transition-all focus-within:ring-2 focus-within:ring-cyan-400 focus-within:border-cyan-200 ${error ? 'border-red-200 focus-within:ring-red-200' : ''}`}
    >
      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block mb-1">
        Price
      </label>
      <div className="flex items-center gap-2">
        <span className="font-bold text-slate-400">$</span>
        <input
          type="number"
          min={0}
          step="0.01"
          placeholder="0"
          value={price}
          onChange={(e) => onPriceChange(e.target.value)}
          className="w-full flex-1 bg-transparent text-sm font-bold text-slate-900 outline-none placeholder:text-slate-300"
        />
        <select
          value={currencyCode}
          onChange={(e) => onCurrencyChange(e.target.value)}
          className="rounded-lg bg-slate-100 px-2 py-1.5 text-[10px] font-bold text-slate-700 outline-none cursor-pointer border-0"
        >
          {CURRENCIES.map((c) => (
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
