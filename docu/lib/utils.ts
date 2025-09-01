import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateTableOfContents(content: string) {
  const headings = content.match(/^#{1,6}\s+(.+)$/gm)
  if (!headings) return []

  return headings.map((heading) => {
    const level = heading.match(/^(#{1,6})\s/)?.[1].length || 1
    const text = heading.replace(/^#{1,6}\s+/, '')
    const id = slugify(text)
    
    return {
      level,
      text,
      id,
    }
  })
}
