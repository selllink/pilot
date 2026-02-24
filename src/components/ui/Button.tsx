import { type ButtonHTMLAttributes } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'whatsapp' | 'magic'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  children: React.ReactNode
  fullWidth?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 focus:ring-cyan-400 rounded-xl',
  secondary: 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 focus:ring-slate-400 rounded-xl',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-400 rounded-xl',
  whatsapp: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 rounded-xl',
  magic:
    'relative w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-extrabold uppercase tracking-widest text-sm shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all focus:ring-cyan-400 rounded-full border-0',
}

export function Button({
  variant = 'primary',
  children,
  fullWidth,
  className = '',
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  const width = fullWidth ? 'w-full' : ''

  if (variant === 'magic') {
    return (
      <div className="relative group w-full">
        <div
          className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 blur opacity-30 transition duration-300 group-hover:opacity-50"
          aria-hidden
        />
        <button
          type={type}
          className={`relative ${variantClasses.magic} ${className}`}
          disabled={disabled}
          {...props}
        >
          {children}
        </button>
      </div>
    )
  }

  return (
    <button
      type={type}
      className={`${base} ${variantClasses[variant]} ${width} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
