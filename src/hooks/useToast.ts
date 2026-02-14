import { useState, useCallback } from 'react'

export function useToast() {
  const [message, setMessage] = useState<string | null>(null)

  const show = useCallback((msg: string, durationMs = 2000) => {
    setMessage(msg)
    setTimeout(() => setMessage(null), durationMs)
  }, [])

  return { message, show }
}
