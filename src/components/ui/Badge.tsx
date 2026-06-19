import React from 'react'
import { cn } from '@/lib/cn'

type BadgeProps = {
  children: React.ReactNode
  variant?: 'default' | 'green' | 'red' | 'gray'
  className?: string
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants: Record<string, string> = {
    default: 'bg-slate-100 text-slate-800',
    green: 'bg-emerald-100 text-emerald-800',
    red: 'bg-red-100 text-red-800',
    gray: 'bg-slate-200 text-slate-700',
  }

  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  )
}
