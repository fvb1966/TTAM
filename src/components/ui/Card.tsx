import React from 'react'
import { cn } from '@/lib/cn'

export default function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('bg-white border rounded p-4 shadow-sm', className)}>{children}</div>
}
