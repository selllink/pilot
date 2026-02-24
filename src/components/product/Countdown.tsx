interface CountdownProps {
  expiresAt: string
  className?: string
}

function daysRemaining(expiresAt: string): number {
  const end = new Date(expiresAt).getTime()
  const now = Date.now()
  const diff = end - now
  if (diff <= 0) return 0
  return Math.ceil(diff / (24 * 60 * 60 * 1000))
}

export function Countdown({ expiresAt, className = '' }: CountdownProps) {
  const days = daysRemaining(expiresAt)
  const expired = days <= 0
  return (
    <span className={`text-sm font-medium ${expired ? 'text-red-500' : 'text-slate-600'} ${className}`}>
      {expired ? 'Expirado' : `${days} día${days !== 1 ? 's' : ''} restante${days !== 1 ? 's' : ''}`}
    </span>
  )
}
