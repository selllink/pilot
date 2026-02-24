export type BadgeStatus = 'active' | 'expired'

interface BadgeProps {
  status: BadgeStatus
  className?: string
}

const statusConfig: Record<BadgeStatus, { label: string; className: string }> = {
  active: {
    label: 'Activo',
    className: 'bg-green-100 text-green-700 font-bold text-[10px] uppercase tracking-wider',
  },
  expired: {
    label: 'Expirado',
    className: 'bg-red-100 text-red-600 font-bold text-[10px] uppercase tracking-wider',
  },
}

export function Badge({ status, className = '' }: BadgeProps) {
  const { label, className: statusClass } = statusConfig[status]
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium ${statusClass} ${className}`}
    >
      {label}
    </span>
  )
}
