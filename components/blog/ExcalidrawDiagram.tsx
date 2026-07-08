import Image from 'next/image'

interface ExcalidrawDiagramProps {
  src: string
  alt: string
  caption?: string
  width?: number
  height?: number
}

export function ExcalidrawDiagram({
  src,
  alt,
  caption,
  width = 1600,
  height = 900,
}: ExcalidrawDiagramProps) {
  return (
    <figure className="not-prose my-10">
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto"
          sizes="(max-width: 1024px) 100vw, 900px"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-gray-500 italic">{caption}</figcaption>
      )}
    </figure>
  )
}
