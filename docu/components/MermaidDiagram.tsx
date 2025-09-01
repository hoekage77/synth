'use client'

import { useEffect, useRef, useState } from 'react'

interface MermaidDiagramProps {
  chart: string
  className?: string
}

export default function MermaidDiagram({ chart, className = '' }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current) return

      try {
        setIsLoading(true)
        setError(null)

        // Wait for Mermaid to be available
        if (typeof window !== 'undefined' && (window as any).mermaid) {
          const mermaid = (window as any).mermaid
          
          mermaid.initialize({
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose',
            fontFamily: 'Inter, sans-serif',
          })

          const id = 'mermaid-' + Math.random().toString(36).substr(2, 9)
          containerRef.current.id = id

          const { svg } = await mermaid.render(id, chart)
          containerRef.current.innerHTML = svg
          setIsLoading(false)
        } else {
          // If Mermaid isn't loaded yet, wait a bit and try again
          setTimeout(() => renderDiagram(), 100)
        }
      } catch (err) {
        console.error('Mermaid rendering error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setIsLoading(false)
      }
    }

    renderDiagram()
  }, [chart])

  if (isLoading) {
    return (
      <div className={`mermaid-loading ${className}`} style={{ textAlign: 'center', margin: '2rem 0' }}>
        <div className="text-gray-500">Loading diagram...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`mermaid-error ${className}`} style={{ textAlign: 'center', margin: '2rem 0' }}>
        <div className="text-red-500 p-4 border border-red-300 rounded bg-red-50">
          Error rendering diagram: {error}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`mermaid-diagram ${className}`}
      style={{ textAlign: 'center', margin: '2rem 0' }}
    />
  )
}
