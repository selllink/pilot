import { useRef, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { User } from '@supabase/supabase-js'

interface UserMenuProps {
  user: User
  onSignOut: () => Promise<void>
}

export function UserMenu({ user, onSignOut }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const displayName =
    (user.user_metadata?.full_name as string) ??
    (user.user_metadata?.name as string) ??
    user.email ??
    'Usuario'
  const avatarUrl = (user.user_metadata?.picture as string) ?? (user.user_metadata?.avatar_url as string)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  const handleSignOut = async () => {
    setOpen(false)
    await onSignOut()
    navigate('/')
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-slate-200 bg-white shadow-sm transition hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Menú de usuario"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <span className="text-sm font-medium text-slate-600">
            {displayName.charAt(0).toUpperCase()}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-20 mt-2 w-64 rounded-lg border border-slate-200 bg-white py-2 shadow-lg"
          role="menu"
        >
          <div className="border-b border-slate-100 px-3 py-2">
            <p className="truncate font-medium text-slate-900">{displayName}</p>
            <p className="truncate text-sm text-slate-500">{user.email}</p>
          </div>
          <Link
            to="/dashboard"
            className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
            role="menuitem"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}
