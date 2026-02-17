import { Outlet, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { UserMenu } from './UserMenu'

export function Layout() {
  const { user, loading, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
          <Link to="/" className="font-medium text-slate-900">
            LinkVenta Express
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
