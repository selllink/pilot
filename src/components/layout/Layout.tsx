import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { UserMenu } from './UserMenu'

export function Layout() {
  const { user, loading, signOut } = useAuth()
  const location = useLocation()
  const isDashboard = location.pathname === '/dashboard'
  const hideHeaderAvatar = isDashboard && user

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <picture>
              <source srcSet="/logo-64.webp" type="image/webp" />
              <img
                src="/logo-64.png"
                alt=""
                className="h-8 w-8 object-contain"
                width={32}
                height={32}
              />
            </picture>
            <span className="text-lg font-extrabold tracking-tight text-[#0F172A]">LinkVenta</span>
            <span className="text-base font-medium text-slate-400">Express</span>
          </Link>
          {!loading && !hideHeaderAvatar && (
            user ? (
              <UserMenu user={user} onSignOut={signOut} />
            ) : (
              <Link
                to="/dashboard"
                className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-200"
              >
                Mis Listings
              </Link>
            )
          )}
        </div>
      </header>
      <main className="mx-auto max-w-lg px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
