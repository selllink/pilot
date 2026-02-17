import { type InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  /** Envuelve en tarjeta blanca bento con focus-within ring cyan */
  card?: boolean
}

const labelClass = 'text-[10px] uppercase font-bold text-slate-400 tracking-widest block mb-1'

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, error, card = false, className = '', id, ...props }, ref) {
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, '-')
    const inputEl = (
      <>
        {label && (
          <label htmlFor={inputId} className={labelClass}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full bg-transparent text-sm font-medium text-slate-900 outline-none
            placeholder:text-slate-300
            disabled:text-slate-500
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1 text-[10px] text-red-500">{error}</p>}
      </>
    )
    if (card) {
      return (
        <div
          className={`rounded-[2rem] border border-slate-100 bg-white p-4 shadow-sm transition-all focus-within:ring-2 focus-within:ring-cyan-400 focus-within:border-cyan-200 ${error ? 'border-red-200 focus-within:ring-red-200' : ''}`}
        >
          {inputEl}
        </div>
      )
    }
    return <div className="w-full">{inputEl}</div>
  }
)
