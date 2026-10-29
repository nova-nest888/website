'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { TestimonialDoc } from '@/types'
import ImageUpload from '@/components/ui/ImageUpload'

export default function EditTestimonial({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [id, setId]         = useState('')
  const [form, setForm]     = useState<{ name: string; role: string; content: string; image: string } | null>(null)
  const [missing, setMissing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  useEffect(() => {
    params.then(p => {
      setId(p.id)
      fetch('/api/testimonials').then(r => r.json()).then(d => {
        const t = (d.data ?? []).find((x: TestimonialDoc) => x.id === p.id)
        if (t) setForm({ name: t.name, role: t.role ?? '', content: t.content, image: t.image ?? '' }); else setMissing(true)
      }).catch(() => setMissing(true))
    })
  }, [params])

  const submit = async () => {
    if (!form) return
    if (!form.name || form.content.length < 10) { setError('Name is required and the text needs at least 10 characters.'); return }
    setSaving(true); setError('')
    const res  = await fetch(`/api/testimonials/${id}`, { method:'PATCH', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(form) })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) { setError(json.error ?? 'Could not save.'); setSaving(false); return }
    router.push('/admin/testimonials')
  }

  if (missing) return <div style={{ padding:'3rem', fontFamily:'Inter,sans-serif', color:'#c0392b' }}>Testimonial not found.</div>
  if (!form)   return <div style={{ padding:'3rem', fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.2rem', fontStyle:'italic', color:'var(--text-ghost)' }}>Loading…</div>

  return (
    <div style={{ maxWidth: 640 }}>
      <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'2rem', fontWeight:300, color:'var(--forest-800)', marginBottom:'2rem' }}>Edit Testimonial</h1>
      <div style={{ background:'white', padding:'2.5rem', display:'flex', flexDirection:'column', gap:'1.5rem' }}>
        <div className="nn-rg-sm" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
          <div><label className="field-label">Client Name *</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="field-input"/></div>
          <div><label className="field-label">Session / Label</label>
            <input type="text" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="field-input"/></div>
        </div>
        <div><label className="field-label">Their Words *</label>
          <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={5} className="field-input" style={{ resize:'vertical' }}/>
          <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.62rem', color:'var(--text-ghost)', marginTop:'0.3rem' }}>Quotation marks are added automatically on the site.</div></div>
        <div>
          <label className="field-label">Photo (optional)</label>
          <ImageUpload value={form.image || null} onChange={url => setForm({ ...form, image: url })} aspectRatio="4/5" label="Upload photo" allowVideo={false} style={{ maxWidth: 220 }} />
          <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.62rem', color:'var(--text-ghost)', marginTop:'0.3rem' }}>Shown beside this testimonial on the homepage.</div>
          {form.image && <button type="button" onClick={() => setForm({ ...form, image: '' })} style={{ background:'none', border:'none', cursor:'pointer', fontFamily:'Inter,sans-serif', fontSize:'0.66rem', color:'#c0392b', padding:'0.3rem 0' }}>Remove photo</button>}
        </div>
        {error && <div style={{ padding:'0.8rem 1rem', background:'#fef2f2', border:'1px solid #fecaca', fontFamily:'Inter,sans-serif', fontSize:'0.8rem', color:'#c0392b' }}>{error}</div>}
        <div style={{ display:'flex', gap:'1rem' }}>
          <button onClick={submit} disabled={saving} className="btn btn-forest">{saving ? 'Saving…' : 'Save'}</button>
          <button onClick={() => router.back()} className="btn btn-outline">Cancel</button>
        </div>
      </div>
    </div>
  )
}
