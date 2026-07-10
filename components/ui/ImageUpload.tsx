'use client'
import { useState } from 'react'
import { uploadToCloudinary } from '@/lib/cloudinary'

interface ImageUploadProps {
  value?: string | null
  onChange: (url: string) => void
  aspectRatio?: string
  label?: string
  style?: React.CSSProperties
}

export default function ImageUpload({ value, onChange, aspectRatio = '4/3', label = 'Upload Image', style }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value ?? null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = '' // allow re-selecting the same file later

    // Instant local preview while the real upload happens in the background
    const localPreview = URL.createObjectURL(file)
    setPreview(localPreview)
    setError('')
    setUploading(true)

    try {
      const { url } = await uploadToCloudinary(file)
      setPreview(url)
      onChange(url)
    } catch (err) {
      setPreview(value ?? null) // revert to whatever was there before
      setError(err instanceof Error ? err.message : 'Upload failed — please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <div className="upload-zone" style={{ aspectRatio, background: 'var(--parchment-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: uploading ? 0.6 : 1, ...style }}>
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '1.5rem', color: 'var(--forest-300)', marginBottom: '0.6rem', opacity: 0.5 }}>↑</div>
            <div style={{ fontFamily: 'Inter,sans-serif', fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--forest-400)', marginBottom: '0.2rem' }}>{label}</div>
            <div style={{ fontFamily: 'Inter,sans-serif', fontSize: '0.7rem', color: 'var(--text-ghost)' }}>Click to select</div>
          </div>
        )}
        <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} />
        <div className="upload-overlay">
          <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'white' }}>
            {uploading ? 'Uploading…' : preview ? '↑ Change' : '↑ Upload'}
          </span>
        </div>
      </div>
      {uploading && (
        <div style={{ fontFamily: 'Inter,sans-serif', fontSize: '0.68rem', color: 'var(--text-ghost)', marginTop: '0.5rem' }}>
          Uploading to Cloudinary…
        </div>
      )}
      {error && (
        <div style={{ fontFamily: 'Inter,sans-serif', fontSize: '0.7rem', color: '#c0392b', marginTop: '0.5rem', lineHeight: 1.5 }}>
          {error}
        </div>
      )}
    </div>
  )
}
