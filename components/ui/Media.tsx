'use client'
import { isVideoUrl } from '@/lib/cloudinary'

interface MediaProps {
  src: string
  alt?: string
  style?: React.CSSProperties
  onError?: () => void
  className?: string
}

/** Renders a <video> or <img> depending on the URL — lets any image "slot"
 *  on the site (hero, portrait, offering photo, gallery item) also hold a
 *  short video clip uploaded by an admin. */
export default function Media({ src, alt = '', style, onError, className }: MediaProps) {
  if (isVideoUrl(src)) {
    return (
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        style={style}
        className={className}
        onError={onError}
      />
    )
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} style={style} onError={onError} className={className} />
}
