import { Button } from '../ui/Button'

interface AuthModalProps {
  onClose: () => void
  onSignIn: () => void
}

export function AuthModal({ onClose, onSignIn }: AuthModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-slate-900">Sign in to edit</h2>
        <p className="mt-1 text-sm text-slate-600">
          Use the same email you used when creating this listing to edit or delete it.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <Button variant="primary" fullWidth onClick={onSignIn}>
            Sign in with Google
          </Button>
          <Button variant="ghost" fullWidth onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
