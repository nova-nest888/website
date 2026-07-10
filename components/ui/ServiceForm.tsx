'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toSlug } from '@/lib/utils'
import type { ServiceDoc } from '@/types'

const CATEGORIES = ['Nature','Movement','Presence','Growth','Immersion','Community']

interface ServiceFormProps {
  initial?: Partial<ServiceDoc>
  onSave: (data: Record<string, unknown>) => Promise<void>
}

export default function ServiceForm({ initial = {}, onSave }: ServiceFormProps) {
  const router = useRouter()
  const [form, setForm] = useState({
    title:       initial.title       ?? '',
    slug:        initial.slug        ?? '',
    description: initial.description ?? '',
    category:    initial.category    ?? 'Nature',
    duration:    initial.duration    ?? 60,
    price:       initial.price       ?? 0,
    calSlug:     initial.calSlug     ?? '',
    isActive:    initial.isActive    ?? true,
  })
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')
  const [saved,  setSaved]  = useState(false)

  const set = (k: string, v: string | number | boolean) =>
    setForm(f => ({ ...f, [k]: v, ...(k === 'title' ? { slug: toSlug(v as string), calSlug: toSlug(v as string) } : {}) }))

  const submit = async () => {
    if (!form.title || !form.slug) { setError('Title and slug are required.'); return }
    setSaving(true); setError('')
    try {
      await onSave({ ...form, duration: Number(form.duration), price: Number(form.price) })
      setSaved(true)
      setTimeout(() => router.push('/admin/services'), 600)
    } catch (e: any) {
      setError(e.message ?? 'Could not save.'); setSaving(false)
    }
  }

  return (
    <div style={{ background:'white', padding:'2.5rem', display:'flex', flexDirection:'column', gap:'1.5rem' }}>
      <div>
        <label className="field-label">Title *</label>
        <input type="text" value={form.title} onChange={e => set('title', e.target.value)} className="field-input" placeholder="e.g. Nature Experience — Half Day" style={{ fontSize:'1rem' }}/>
      </div>

      <div className="nn-rg-sm" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
        <div>
          <label className="field-label">URL Slug *</label>
          <input type="text" value={form.slug} onChange={e => set('slug', e.target.value)} className="field-input" placeholder="nature-half-day"/>
        </div>
        <div>
          <label className="field-label">Cal.com Event Slug</label>
          <input type="text" value={form.calSlug} onChange={e => set('calSlug', e.target.value)} className="field-input" placeholder="must match your Cal.com event type"/>
          <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.62rem', color:'var(--text-ghost)', marginTop:'0.3rem' }}>
            cal.com/YOUR_USERNAME/<strong>{form.calSlug || 'slug'}</strong>
          </div>
        </div>
      </div>

      <div className="nn-rg3" style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1rem' }}>
        <div>
          <label className="field-label">Category</label>
          <select value={form.category} onChange={e => set('category', e.target.value)} className="field-input" style={{ cursor:'pointer' }}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label">Duration (min)</label>
          <input type="number" value={form.duration} onChange={e => set('duration', e.target.value)} className="field-input" min={15} step={15}/>
        </div>
        <div>
          <label className="field-label">Price ($) — 0 = free</label>
          <input type="number" value={form.price} onChange={e => set('price', e.target.value)} className="field-input" min={0} step={5}/>
        </div>
      </div>

      <div>
        <label className="field-label">Description</label>
        <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={4} className="field-input" style={{ resize:'vertical' }} placeholder="What happens in this session? Keep it specific and honest."/>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:'0.7rem', padding:'0.8rem 1rem', background:'var(--parchment-mid)' }}>
        <input type="checkbox" id="active" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} style={{ accentColor:'var(--forest-600)', width:16, height:16 }}/>
        <label htmlFor="active" style={{ fontFamily:'Inter,sans-serif', fontSize:'0.85rem', color:'var(--text-body)', cursor:'pointer' }}>
          Active <span style={{ color:'var(--text-ghost)', fontSize:'0.76rem' }}>(unchecked = hidden from booking page)</span>
        </label>
      </div>

      {error && <div style={{ padding:'0.8rem 1rem', background:'#fef2f2', border:'1px solid #fecaca', fontFamily:'Inter,sans-serif', fontSize:'0.8rem', color:'#c0392b' }}>{error}</div>}

      <div style={{ display:'flex', gap:'1rem', alignItems:'center' }}>
        <button onClick={submit} disabled={saving || !form.title} className="btn btn-forest" style={{ opacity: !form.title ? 0.4 : 1 }}>
          {saving ? 'Saving…' : 'Save Service'}
        </button>
        <button onClick={() => router.back()} className="btn btn-outline">Cancel</button>
        {saved && <span style={{ fontFamily:'Inter,sans-serif', fontSize:'0.76rem', color:'var(--forest-500)' }}>✓ Saved</span>}
      </div>
    </div>
  )
}
