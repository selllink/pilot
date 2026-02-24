import { Outlet, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { UserMenu } from './UserMenu'

export function Layout() {
  const { user, loading, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <header className="sticky top-0 z-10 border-b border-slate-100 bg-white">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between gap-4 px-4">
          <Link to="/" className="flex shrink-0 items-center gap-2">
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
          {!loading && (
            <div className="flex shrink-0 items-center gap-3">
              <Link
                to="/dashboard"
                className="rounded-full border border-slate-200/80 bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:border-slate-200 hover:text-slate-600"
              >
                Mis Listings
              </Link>
              {user && <UserMenu user={user} onSignOut={signOut} />}
            </div>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-lg px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
