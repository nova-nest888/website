'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewTestimonial() {
  const router  = useRouter()
  const [form, setForm]     = useState({ name:'', role:'', content:'', rating:5 })
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')

  const set = (k: string, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  const submit = async () => {
    if (!form.name || !form.content) { setError('Name and testimonial text are required.'); return }
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed')
      router.push('/admin/testimonials')
    } catch (e: any) {
      setError(e.message ?? 'Could not save.'); setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'2.5rem' }}>
        <button onClick={() => router.back()} style={{ background:'none', border:'none', cursor:'pointer', fontFamily:'Inter,sans-serif', fontSize:'0.65rem', fontWeight:500, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--forest-500)', padding:0 }}>← Back</button>
        <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'2rem', fontWeight:300, color:'var(--forest-800)' }}>Add Testimonial</h1>
      </div>

      <div style={{ background:'white', padding:'2.5rem', display:'flex', flexDirection:'column', gap:'1.5rem' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
          <div>
            <label className="field-label">Client Name *</label>
            <input type="text" value={form.name} onChange={e => set('name', e.target.value)} className="field-input" placeholder="First name or full name"/>
          </div>
          <div>
            <label className="field-label">Session / Label</label>
            <input type="text" value={form.role} onChange={e => set('role', e.target.value)} className="field-input" placeholder="e.g. Sound Healing Session"/>
          </div>
        </div>

        <div>
          <label className="field-label">Their Words *</label>
          <textarea
            value={form.content}
            onChange={e => set('content', e.target.value)}
            rows={5} className="field-input" style={{ resize:'vertical' }}
            placeholder="What they said — in their own words or paraphrased with permission. Specific is always better than polished."
          />
          <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.62rem', color:'var(--text-ghost)', marginTop:'0.3rem' }}>
            Quotation marks are added automatically on the site. Write the text without them.
          </div>
        </div>

        <div>
          <label className="field-label" style={{ marginBottom:'0.7rem' }}>Rating</label>
          <div style={{ display:'flex', alignItems:'center', gap:'0.3rem' }}>
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => set('rating', n)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'1.6rem', padding:'0 2px', lineHeight:1, color: n <= form.rating ? 'var(--gold)' : 'var(--border-strong)', transition:'color 0.15s ease' }}>◆</button>
            ))}
            <span style={{ fontFamily:'Inter,sans-serif', fontSize:'0.75rem', color:'var(--text-muted)', marginLeft:'0.5rem' }}>{form.rating} / 5</span>
          </div>
        </div>

        {/* Live preview */}
        {(form.content || form.name) && (
          <div style={{ background:'var(--parchment-mid)', padding:'1.5rem', borderLeft:'3px solid var(--gold)' }}>
            <div className="overline" style={{ marginBottom:'0.8rem', color:'var(--text-ghost)' }}>Preview</div>
            <div style={{ fontFamily:'serif', fontSize:'1.8rem', color:'var(--gold)', opacity:0.35, lineHeight:1, marginBottom:'0.5rem' }}>"</div>
            <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.1rem', fontStyle:'italic', color:'var(--forest-800)', lineHeight:1.65, marginBottom:'0.8rem' }}>
              {form.content || '…'}
            </p>
            <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.78rem', fontWeight:600, color:'var(--text-primary)' }}>{form.name || 'Name'}</div>
            {form.role && <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.7rem', color:'var(--gold)', marginTop:'0.15rem' }}>{form.role}</div>}
          </div>
        )}

        {error && <div style={{ padding:'0.8rem 1rem', background:'#fef2f2', border:'1px solid #fecaca', fontFamily:'Inter,sans-serif', fontSize:'0.8rem', color:'#c0392b' }}>{error}</div>}

        <div style={{ display:'flex', gap:'1rem' }}>
          <button onClick={submit} disabled={saving || !form.name || !form.content} className="btn btn-forest" style={{ opacity: (!form.name || !form.content) ? 0.4 : 1 }}>
            {saving ? 'Saving…' : 'Add Testimonial'}
          </button>
          <button onClick={() => router.back()} className="btn btn-outline">Cancel</button>
        </div>
      </div>
    </div>
  )
}
