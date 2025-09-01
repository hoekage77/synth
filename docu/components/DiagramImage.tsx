interface DiagramImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
}

export default function DiagramImage({ 
  src, 
  alt, 
  className = '', 
  width,
  height 
}: DiagramImageProps) {
  return (
    <div className={`diagram-image ${className} flex justify-center items-center my-12`}>
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
        <img 
          src={src} 
          alt={alt}
          className="relative z-10 max-w-full h-auto rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-3xl"
          style={{
            maxWidth: '100%',
            height: 'auto'
          }}
          width={width}
          height={height}
        />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-slate-900/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>
  )
}
