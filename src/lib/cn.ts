import { twMerge } from 'tailwind-merge'
import clsx from 'clsx'

export function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(...(inputs as unknown as Parameters<typeof clsx>)))
}

export default cn
