import React, { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function Login({ onAuth }: { onAuth?: (user: any) => void }) {
  const [hasAdmin, setHasAdmin] = useState<boolean | null>(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const has = await (window as any).ttam.auth.hasAdmin()
        if (!mounted) return
        setHasAdmin(Boolean(has))
      } catch (err) {
        setHasAdmin(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const handleCreate = async () => {
    if (!username || !password) return alert('Ingrese usuario y contraseña')
    if (password !== confirmPassword) return alert('Las contraseñas no coinciden')
    setLoading(true)
    try {
      const user = await (window as any).ttam.auth.createAdmin({ username, password })
      alert('Administrador creado')
      if (onAuth) onAuth(user)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      alert('Error creando administrador: ' + (err && err.message ? err.message : ''))
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    if (!username || !password) return alert('Ingrese usuario y contraseña')
    setLoading(true)
    try {
      const user = await (window as any).ttam.auth.login({ username, password })
      if (onAuth) onAuth(user)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      alert('Credenciales inválidas')
    } finally {
      setLoading(false)
    }
  }

  if (hasAdmin === null) return <div>Cargando...</div>

  return (
    <div className="flex items-center justify-center h-full">
      <Card>
        <h3 className="text-lg font-medium mb-4">{hasAdmin ? 'Iniciar sesión' : 'Crear administrador'}</h3>
        <div className="space-y-3">
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Usuario" className="p-2 border rounded w-full" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" className="p-2 border rounded w-full" />
          {!hasAdmin && (
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirmar contraseña" className="p-2 border rounded w-full" />
          )}
          <div className="flex gap-2">
            {hasAdmin ? (
              <Button onClick={handleLogin} disabled={loading}>Entrar</Button>
            ) : (
              <Button onClick={handleCreate} disabled={loading}>Crear administrador</Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
