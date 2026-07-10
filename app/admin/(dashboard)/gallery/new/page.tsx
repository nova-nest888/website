'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from '@/components/ui/ImageUpload'

const CATEGORIES = ['general','nature','movement','presence','growth','community','immersion']

export default function NewPhoto() {
  const router  = useRouter()
  const [mode, setMode]     = useState<'upload' | 'url'>('upload')
  const [form, setForm]     = useState({ url:'', caption:'', category:'general', order:0 })
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')
  const [imgOk,  setImgOk]  = useState<boolean | null>(null)

  const set = (k: string, v: string | number) => {
    setForm(f => ({ ...f, [k]: v }))
    if (k === 'url') setImgOk(null)
  }

  const submit = async () => {
    if (!form.url) { setError(mode === 'upload' ? 'Upload a photo first.' : 'Image URL is required.'); return }
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, order: Number(form.order) }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed')
      router.push('/admin/gallery')
    } catch (e: any) {
      setError(e.message ?? 'Could not save.'); setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'2.5rem' }}>
        <button onClick={() => router.back()} style={{ background:'none', border:'none', cursor:'pointer', fontFamily:'Inter,sans-serif', fontSize:'0.65rem', fontWeight:500, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--forest-500)', padding:0 }}>← Back</button>
        <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'2rem', fontWeight:300, color:'var(--forest-800)' }}>Add Photo</h1>
      </div>

      <div style={{ background:'white', padding:'2.5rem', display:'flex', flexDirection:'column', gap:'1.5rem' }}>

        <div style={{ display:'flex', gap:'0', border:'1.5px solid var(--border-strong)', width:'fit-content' }}>
          {(['upload','url'] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setError('') }}
              style={{
                fontFamily:'Inter,sans-serif', fontSize:'0.65rem', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase',
                padding:'0.6rem 1.2rem', cursor:'pointer', border:'none',
                background: mode === m ? 'var(--forest-700)' : 'transparent',
                color: mode === m ? 'white' : 'var(--text-muted)',
              }}>
              {m === 'upload' ? 'Upload from device' : 'Paste a URL'}
            </button>
          ))}
        </div>

        {mode === 'upload' ? (
          <div>
            <label className="field-label">Photo *</label>
            <ImageUpload
              value={form.url || null}
              onChange={url => set('url', url)}
              aspectRatio="4/3"
              label="Upload Photo"
              style={{ maxWidth: '320px' }}
            />
          </div>
        ) : (
          <div>
            <label className="field-label">Image URL *</label>
            <input type="text" value={form.url} onChange={e => set('url', e.target.value)} className="field-input" placeholder="https://..."/>
            <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.62rem', color:'var(--text-ghost)', marginTop:'0.3rem' }}>
              Paste a link to an image that's already hosted somewhere (Unsplash, another site, etc).
            </div>
            {form.url && (
              <div style={{ marginTop:'1rem', aspectRatio:'4/3', maxWidth:'320px', background:'var(--parchment-mid)', overflow:'hidden' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.url} alt=""
                  style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
                  onLoad={() => setImgOk(true)}
                  onError={() => setImgOk(false)}
                />
              </div>
            )}
            {imgOk === false && (
              <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.7rem', color:'#c0392b', marginTop:'0.5rem' }}>
                Couldn't load that URL — double-check it's a direct link to an image.
              </div>
            )}
          </div>
        )}

        <div className="nn-rg-sm" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
          <div>
            <label className="field-label">Category</label>
            <select value={form.category} onChange={e => set('category', e.target.value)} className="field-input">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Order</label>
            <input type="number" value={form.order} onChange={e => set('order', Number(e.target.value))} className="field-input" placeholder="0"/>
          </div>
        </div>

        <div>
          <label className="field-label">Caption</label>
          <input type="text" value={form.caption} onChange={e => set('caption', e.target.value)} className="field-input" placeholder="Optional — shown on hover"/>
        </div>

        {error && <div style={{ padding:'0.8rem 1rem', background:'#fef2f2', border:'1px solid #fecaca', fontFamily:'Inter,sans-serif', fontSize:'0.8rem', color:'#c0392b' }}>{error}</div>}

        <div style={{ display:'flex', gap:'1rem' }}>
          <button onClick={submit} disabled={saving || !form.url} className="btn btn-forest" style={{ opacity: !form.url ? 0.4 : 1 }}>
            {saving ? 'Saving…' : 'Add Photo'}
          </button>
          <button onClick={() => router.back()} className="btn btn-outline">Cancel</button>
        </div>
      </div>
    </div>
  )
}
