export type BadgeStatus = 'active' | 'expired'

interface BadgeProps {
  status: BadgeStatus
  className?: string
}

const statusConfig: Record<BadgeStatus, { label: string; className: string }> = {
  active: {
    label: 'Activo',
    className: 'bg-green-100 text-green-600 font-black text-[10px] uppercase',
  },
  expired: {
    label: 'Expirado',
    className: 'bg-red-100 text-red-600',
  },
}

export function Badge({ status, className = '' }: BadgeProps) {
  const { label, className: statusClass } = statusConfig[status]
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass} ${className}`}
    >
      {label}
    </span>
  )
}
