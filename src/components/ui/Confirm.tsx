import React, { createContext, useContext, useRef, useState, ReactNode } from 'react'

type ConfirmOptions = {
  title?: string
  confirmLabel?: string
  cancelLabel?: string
}

type ConfirmContextType = {
  confirm: (message: string, opts?: ConfirmOptions) => Promise<boolean>
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined)

export function useConfirm() {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider')
  return ctx.confirm
}

export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [title, setTitle] = useState('')
  const [confirmLabel, setConfirmLabel] = useState('Confirmar')
  const [cancelLabel, setCancelLabel] = useState('Cancelar')
  const resolveRef = useRef<((v: boolean) => void) | null>(null)

  const confirm = (msg: string, opts?: ConfirmOptions) => new Promise<boolean>(resolve => {
    setMessage(msg)
    setTitle(opts?.title || '')
    setConfirmLabel(opts?.confirmLabel || 'Confirmar')
    setCancelLabel(opts?.cancelLabel || 'Cancelar')
    resolveRef.current = resolve
    setOpen(true)
  })

  const close = (val: boolean) => {
    setOpen(false)
    if (resolveRef.current) {
      resolveRef.current(val)
      resolveRef.current = null
    }
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded shadow-lg p-4 max-w-md w-full">
            {title && <div className="font-semibold mb-2">{title}</div>}
            <div className="mb-4">{message}</div>
            <div className="flex justify-end gap-2">
              <button className="px-3 py-1 rounded border" onClick={() => close(false)}>{cancelLabel}</button>
              <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={() => close(true)}>{confirmLabel}</button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  )
}

export default ConfirmProvider
