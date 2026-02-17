import { Outlet, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { UserMenu } from './UserMenu'

export function Layout() {
  const { user, loading, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-medium text-slate-900">
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
            <span>LinkVenta Express</span>
          </Link>
          {!loading && (
            user ? (
              <UserMenu user={user} onSignOut={signOut} />
            ) : (
              <Link to="/dashboard" className="text-sm text-slate-600 hover:text-slate-900">
                Dashboard
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
