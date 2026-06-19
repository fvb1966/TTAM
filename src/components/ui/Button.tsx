import React from 'react'
import { cn } from '@/lib/cn'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
}

export default function Button({ className, variant = 'default', size = 'md', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
  const variants: Record<string, string> = {
    default: 'bg-slate-900 text-white hover:bg-slate-800',
    ghost: 'bg-transparent text-slate-900 hover:bg-slate-100',
    destructive: 'bg-red-600 text-white hover:bg-red-500',
  }
  const sizes: Record<string, string> = {
    sm: 'text-sm px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-2',
  }

  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />
}
