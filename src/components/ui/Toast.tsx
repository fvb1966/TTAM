import React, { createContext, useCallback, useContext, useState, ReactNode } from 'react'

type ToastType = 'success' | 'error' | 'info'

type Toast = {
  id: number
  type: ToastType
  title?: string
  message: string
}

type ToastContextType = {
  showToast: (type: ToastType, message: string, title?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const remove = useCallback((id: number) => {
    setToasts(t => t.filter(x => x.id !== id))
  }, [])

  const showToast = useCallback((type: ToastType, message: string, title?: string) => {
    const id = Date.now() + Math.floor(Math.random() * 1000)
    setToasts(t => [...t, { id, type, title, message }])
    setTimeout(() => remove(id), 4500)
  }, [remove])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
        {toasts.map(t => (
          <div
            key={t.id}
            className={
              'max-w-sm w-full p-3 rounded shadow-md text-sm animate-fade-in ' +
              (t.type === 'success' ? 'bg-emerald-500 text-white' : t.type === 'error' ? 'bg-red-600 text-white' : 'bg-slate-800 text-white')
            }
          >
            {t.title && <div className="font-semibold">{t.title}</div>}
            <div>{t.message}</div>
            <div className="mt-1 text-xs opacity-90 text-right">
              <button onClick={() => remove(t.id)} className="underline">Cerrar</button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export default ToastProvider
