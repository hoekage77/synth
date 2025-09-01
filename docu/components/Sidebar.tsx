'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavItem {
  title: string
  href: string
  icon?: React.ReactNode
  children?: NavItem[]
}

const navigation: NavItem[] = [
  {
    title: 'Getting Started',
    href: '/',
    icon: <span className="w-5 h-5">🏠</span>,
  },
  {
    title: 'System Architecture',
    href: '/system-architecture',
    icon: <span className="w-5 h-5">📚</span>,
  },
  {
    title: 'Test Diagrams',
    href: '/test-diagrams',
    icon: <span className="w-5 h-5">🧪</span>,
  },
  {
    title: 'API Reference',
    href: '/api-reference',
    icon: <span className="w-5 h-5">🔌</span>,
    children: [
      {
        title: 'Authentication',
        href: '/api-reference/authentication',
      },
      {
        title: 'Agents',
        href: '/api-reference/agents',
      },
      {
        title: 'Tools',
        href: '/api-reference/tools',
      },
      {
        title: 'Workflows',
        href: '/api-reference/workflows',
      },
    ],
  },
  {
    title: 'Deployment',
    href: '/deployment',
    icon: <span className="w-5 h-5">🚀</span>,
    children: [
      {
        title: 'Local Development',
        href: '/deployment/local',
      },
      {
        title: 'Production',
        href: '/deployment/production',
      },
      {
        title: 'Docker',
        href: '/deployment/docker',
      },
    ],
  },
  {
    title: 'Security',
    href: '/security',
    icon: <span className="w-5 h-5">🔒</span>,
  },
  {
    title: 'Troubleshooting',
    href: '/troubleshooting',
    icon: <span className="w-5 h-5">🛠️</span>,
  },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleItem = (href: string) => {
    setExpandedItems(prev =>
      prev.includes(href)
        ? prev.filter(item => item !== href)
        : [...prev, href]
    )
  }

  const isActive = (href: string) => pathname === href
  const isExpanded = (href: string) => expandedItems.includes(href)

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 transform transition-all duration-300 ease-out lg:translate-x-0 lg:static lg:inset-0 lg:sticky lg:top-0 lg:h-screen shadow-xl lg:shadow-none",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/50 to-blue-50/50 dark:from-slate-700/50 dark:to-slate-600/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">X</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Xera Docs
              </span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg bg-slate-100/80 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-600/80 transition-all duration-200"
            >
              <span className="text-lg">❌</span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-6 space-y-3">
            {navigation.map((item) => (
              <div key={item.href}>
                {item.children ? (
                  <button
                    onClick={() => toggleItem(item.href)}
                    className={cn(
                      "flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
                      isActive(item.href)
                        ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-700 dark:text-blue-300 shadow-md"
                        : "text-slate-700 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-700/80 hover:shadow-sm"
                    )}
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                      {item.icon}
                    </span>
                    <span className="ml-3 flex-1 text-left">{item.title}</span>
                    {isExpanded(item.href) ? (
                      <span className="w-4 h-4 text-slate-500 transition-transform duration-200">▼</span>
                    ) : (
                      <span className="w-4 h-4 text-slate-500 transition-transform duration-200">▶</span>
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
                      isActive(item.href)
                        ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-700 dark:text-blue-300 shadow-md"
                        : "text-slate-700 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-700/80 hover:shadow-sm"
                    )}
                    onClick={onClose}
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                      {item.icon}
                    </span>
                    <span className="ml-3">{item.title}</span>
                  </Link>
                )}

                {/* Children */}
                {item.children && isExpanded(item.href) && (
                  <div className="ml-6 mt-2 space-y-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200",
                          isActive(child.href)
                            ? "bg-blue-50/80 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 shadow-sm"
                            : "text-slate-600 hover:bg-slate-50/80 dark:text-slate-400 dark:hover:bg-slate-700/80"
                        )}
                        onClick={onClose}
                      >
                        <span className="ml-3">{child.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/50 to-blue-50/50 dark:from-slate-700/50 dark:to-slate-600/50">
            <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
              <div className="font-medium mb-1">Xera AI Worker</div>
              <div className="text-xs opacity-75">v1.0</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
