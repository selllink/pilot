import { Button } from '../ui/Button'

interface AuthModalProps {
  onClose: () => void
  onSignIn: () => void
}

export function AuthModal({ onClose, onSignIn }: AuthModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg">
        <h2 className="text-lg font-bold text-[#0F172A]">Inicia sesión para editar</h2>
        <p className="mt-1 text-sm text-slate-600">
          Usa el mismo email con el que creaste este listing para editarlo o eliminarlo.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <Button variant="primary" fullWidth onClick={onSignIn}>
            Iniciar sesión con Google
          </Button>
          <Button variant="ghost" fullWidth onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}
