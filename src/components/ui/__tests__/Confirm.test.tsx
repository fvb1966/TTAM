import React, { useState } from 'react'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { describe, it, expect, afterEach } from 'vitest'

afterEach(() => cleanup())

import ConfirmProvider, { useConfirm } from '../Confirm'

function TestApp() {
  const confirm = useConfirm()
  const [result, setResult] = useState<string | null>(null)

  const open = async () => {
    const r = await confirm('¿Confirmar acción?', { title: 'Atención', confirmLabel: 'Sí', cancelLabel: 'No' })
    setResult(String(r))
  }

  return (
    <div>
      <button onClick={open}>Open</button>
      <div data-testid="result">{result ?? ''}</div>
    </div>
  )
}

describe('ConfirmProvider', () => {
  it('resolves true when user confirms', async () => {
    render(
      <ConfirmProvider>
        <TestApp />
      </ConfirmProvider>
    )

    fireEvent.click(screen.getByText('Open'))
    // dialog should show
    expect(screen.getByText('¿Confirmar acción?')).toBeTruthy()
    fireEvent.click(screen.getByText('Sí'))
    const result = await screen.findByTestId('result')
    expect(result.textContent).toBe('true')
  })

  it('resolves false when user cancels', async () => {
    render(
      <ConfirmProvider>
        <TestApp />
      </ConfirmProvider>
    )

    fireEvent.click(screen.getByText('Open'))
    expect(screen.getByText('¿Confirmar acción?')).toBeTruthy()
    fireEvent.click(screen.getByText('No'))
    const result = await screen.findByTestId('result')
    expect(result.textContent).toBe('false')
  })
})
