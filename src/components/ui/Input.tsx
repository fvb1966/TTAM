import React from 'react'
import { cn } from '@/lib/cn'

export default function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn('border p-2 rounded bg-white text-slate-900', props.className)} {...props} />
}
