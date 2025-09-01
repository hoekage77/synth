'use client'

import { useState } from 'react'
import { Sidebar } from './Sidebar'

interface DocLayoutProps {
  children: React.ReactNode
}

export function DocLayout({ children }: DocLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">X</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Xera Docs
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-3 rounded-xl bg-white/60 dark:bg-slate-700/60 backdrop-blur-md text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <span className="text-xl">☰</span>
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content - properly centered */}
        <div className="flex-1">
          <main className="min-h-screen">
            <div className="max-w-4xl mx-auto px-6 py-12">
              <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:bg-gradient-to-r prose-headings:from-slate-900 prose-headings:to-slate-600 prose-headings:dark:from-white prose-headings:dark:to-slate-300 prose-headings:bg-clip-text prose-headings:text-transparent">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
