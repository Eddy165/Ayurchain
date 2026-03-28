import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncate(str: string, length: number) {
  if (str.length <= length) return str;
  return `${str.slice(0, length)}...`;
}

export function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

export function formatHash(hash: string) {
  if (!hash) return ''
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`
}
