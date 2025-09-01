import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Xera/Suna AI Worker Documentation',
  description: 'Comprehensive documentation for the Xera/Suna AI Worker platform - an open-source generalist AI Worker with full-stack architecture.',
  keywords: ['AI Worker', 'AI Agent', 'Documentation', 'Xera', 'Suna', 'FastAPI', 'Next.js'],
  authors: [{ name: 'Xera Team' }],
  openGraph: {
    title: 'Xera/Suna AI Worker Documentation',
    description: 'Comprehensive documentation for the Xera/Suna AI Worker platform',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-white dark:bg-gray-900`}>
        {children}
      </body>
    </html>
  )
}
