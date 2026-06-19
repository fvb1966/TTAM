import React from 'react'
import { cn } from '@/lib/cn'

export default function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('overflow-auto w-full', className)}>
      <table className="min-w-full text-sm table-auto">{children}</table>
    </div>
  )
}
