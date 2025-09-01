'use client'

import { useEffect, useRef, useState } from 'react'

interface PlantUMLDiagramProps {
  code: string
  className?: string
  width?: number
  height?: number
}

export default function PlantUMLDiagram({ 
  code, 
  className = '', 
  width = 800, 
  height = 600 
}: PlantUMLDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current) return

      try {
        setIsLoading(true)
        setError(null)

        // For now, let's use a simpler approach with Kroki
        // This avoids the complexity of PlantUML encoding
        const krokiUrl = `https://kroki.io/graphviz/svg/${encodeURIComponent(code)}`
        
        setImageUrl(krokiUrl)
        setIsLoading(false)
      } catch (err) {
        console.error('Diagram rendering error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setIsLoading(false)
      }
    }

    renderDiagram()
  }, [code])

  if (isLoading) {
    return (
      <div className={`diagram-loading ${className}`} style={{ textAlign: 'center', margin: '2rem 0' }}>
        <div className="text-gray-500">Loading diagram...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`diagram-error ${className}`} style={{ textAlign: 'center', margin: '2rem 0' }}>
        <div className="text-red-500 p-4 border border-red-300 rounded bg-red-50">
          Error rendering diagram: {error}
        </div>
      </div>
    )
  }

  if (!imageUrl) {
    return (
      <div className={`diagram-error ${className}`} style={{ textAlign: 'center', margin: '2rem 0' }}>
        <div className="text-red-500 p-4 border border-red-300 rounded bg-red-50">
          Failed to generate diagram
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`diagram-container ${className}`}
      style={{ textAlign: 'center', margin: '2rem 0' }}
    >
      <img 
        src={imageUrl} 
        alt="Architecture Diagram"
        style={{ 
          maxWidth: '100%', 
          height: 'auto',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem'
        }}
        onError={() => setError('Failed to load diagram image')}
      />
    </div>
  )
}
