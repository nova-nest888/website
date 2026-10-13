'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toSlug } from '@/lib/utils'
<<<<<<< HEAD
import type { ServiceDoc, ServiceOptionGroup } from '@/types'

const CATEGORIES = ['Nature','Movement','Presence','Growth','Immersion','Community']

const PRESETS: Record<string, ServiceOptionGroup> = {
  'Individual / Group': { label: 'How are you joining?', choices: [{ label: 'Individual' }, { label: 'Group' }] },
  'Indoor / Outdoor':   { label: 'Where would you like it?', choices: [{ label: 'Indoor' }, { label: 'Outdoor (in nature)' }] },
}

=======
import type { ServiceDoc } from '@/types'

const CATEGORIES = ['Nature','Movement','Presence','Growth','Immersion','Community']

>>>>>>> 0535e7cc738eba828f46f7a78b8fc6434e5c1a86
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
<<<<<<< HEAD
  const [groups, setGroups] = useState<ServiceOptionGroup[]>(initial.optionGroups ?? [])
=======
>>>>>>> 0535e7cc738eba828f46f7a78b8fc6434e5c1a86
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')
  const [saved,  setSaved]  = useState(false)

  const set = (k: string, v: string | number | boolean) =>
    setForm(f => ({ ...f, [k]: v, ...(k === 'title' ? { slug: toSlug(v as string), calSlug: toSlug(v as string) } : {}) }))

<<<<<<< HEAD
  const updateGroup  = (gi: number, patch: Partial<ServiceOptionGroup>) =>
    setGroups(g => g.map((x, i) => i === gi ? { ...x, ...patch } : x))
  const updateChoice = (gi: number, ci: number, patch: Record<string, unknown>) =>
    setGroups(g => g.map((x, i) => i === gi ? { ...x, choices: x.choices.map((c, j) => j === ci ? { ...c, ...patch } : c) } : x))
  const addGroup     = (g: ServiceOptionGroup) => setGroups(prev => [...prev, JSON.parse(JSON.stringify(g))])
  const removeGroup  = (gi: number) => setGroups(g => g.filter((_, i) => i !== gi))
  const addChoice    = (gi: number) => setGroups(g => g.map((x, i) => i === gi ? { ...x, choices: [...x.choices, { label: '' }] } : x))
  const removeChoice = (gi: number, ci: number) => setGroups(g => g.map((x, i) => i === gi ? { ...x, choices: x.choices.filter((_, j) => j !== ci) } : x))

  const submit = async () => {
    if (!form.title || !form.slug) { setError('Title and slug are required.'); return }
    // Drop empty rows; every question needs a label and at least 2 filled choices
    const cleaned = groups
      .map(g => ({
        label: g.label.trim(),
        choices: g.choices
          .filter(c => c.label.trim())
          .map(c => ({
            label: c.label.trim(),
            description: c.description?.trim() || '',
            calSlug: c.calSlug?.trim() || '',
            ...(c.price !== undefined && !Number.isNaN(c.price) && (c.price as unknown) !== '' ? { price: Number(c.price) } : {}),
          })),
      }))
      .filter(g => g.label || g.choices.length)
    for (const g of cleaned) {
      if (!g.label) { setError('Every booking-option question needs a title (e.g. "How are you joining?").'); return }
      if (g.choices.length < 2) { setError(`"${g.label}" needs at least 2 choices.`); return }
    }
    setSaving(true); setError('')
    try {
      await onSave({ ...form, duration: Number(form.duration), price: Number(form.price), optionGroups: cleaned })
=======
  const submit = async () => {
    if (!form.title || !form.slug) { setError('Title and slug are required.'); return }
    setSaving(true); setError('')
    try {
      await onSave({ ...form, duration: Number(form.duration), price: Number(form.price) })
>>>>>>> 0535e7cc738eba828f46f7a78b8fc6434e5c1a86
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
<<<<<<< HEAD
          <label className="field-label">Price ($) — shown on Experiences & Booking</label>
=======
          <label className="field-label">Price ($) — 0 = free</label>
>>>>>>> 0535e7cc738eba828f46f7a78b8fc6434e5c1a86
          <input type="number" value={form.price} onChange={e => set('price', e.target.value)} className="field-input" min={0} step={5}/>
        </div>
      </div>

      <div>
        <label className="field-label">Description</label>
        <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={4} className="field-input" style={{ resize:'vertical' }} placeholder="What happens in this session? Keep it specific and honest."/>
      </div>

<<<<<<< HEAD
      {/* Booking options — shown to the booker in step 1, before the calendar */}
      <div style={{ borderTop:'1px solid var(--border)', paddingTop:'1.5rem' }}>
        <label className="field-label">Booking options (optional)</label>
        <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.72rem', color:'var(--text-ghost)', lineHeight:1.6, marginBottom:'1rem' }}>
          Questions the booker answers in step 1, before picking a time — e.g. Individual / Group, or Indoor / Outdoor.
          A choice can optionally have its own "from" price and its own Cal.com event slug (useful if outdoor needs a different time slot or length).
        </div>

        {groups.map((g, gi) => (
          <div key={gi} style={{ background:'var(--parchment-mid)', padding:'1.1rem 1.2rem', marginBottom:'0.9rem' }}>
            <div style={{ display:'flex', gap:'0.6rem', alignItems:'center', marginBottom:'0.8rem' }}>
              <input type="text" value={g.label} onChange={e => updateGroup(gi, { label: e.target.value })} className="field-input" placeholder='Question, e.g. "How are you joining?"' style={{ flex:1 }}/>
              <button type="button" onClick={() => removeGroup(gi)} style={{ background:'none', border:'none', cursor:'pointer', color:'#c0392b', fontFamily:'Inter,sans-serif', fontSize:'0.68rem', fontWeight:600 }}>Remove</button>
            </div>
            {g.choices.map((c, ci) => (
              <div key={ci} style={{ display:'grid', gridTemplateColumns:'1.3fr 0.8fr 1fr auto', gap:'0.5rem', marginBottom:'0.5rem', alignItems:'center' }}>
                <input type="text" value={c.label} onChange={e => updateChoice(gi, ci, { label: e.target.value })} className="field-input" placeholder="Choice, e.g. Individual"/>
                <input type="number" min={0} value={c.price ?? ''} onChange={e => updateChoice(gi, ci, { price: e.target.value === '' ? undefined : Number(e.target.value) })} className="field-input" placeholder="From $ (opt.)"/>
                <input type="text" value={c.calSlug ?? ''} onChange={e => updateChoice(gi, ci, { calSlug: e.target.value })} className="field-input" placeholder="Cal slug (opt.)"/>
                <button type="button" onClick={() => removeChoice(gi, ci)} aria-label="Remove choice" style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-ghost)', fontSize:'1rem' }}>×</button>
              </div>
            ))}
            <button type="button" onClick={() => addChoice(gi)} style={{ background:'none', border:'none', cursor:'pointer', fontFamily:'Inter,sans-serif', fontSize:'0.68rem', fontWeight:600, color:'var(--forest-600)', padding:'0.3rem 0' }}>+ Add choice</button>
          </div>
        ))}

        <div style={{ display:'flex', gap:'0.6rem', flexWrap:'wrap' }}>
          {Object.entries(PRESETS).map(([name, preset]) => (
            <button key={name} type="button" onClick={() => addGroup(preset)} className="btn btn-outline" style={{ fontSize:'0.6rem', padding:'0.5rem 0.9rem' }}>+ {name}</button>
          ))}
          <button type="button" onClick={() => addGroup({ label:'', choices:[{ label:'' }, { label:'' }] })} className="btn btn-outline" style={{ fontSize:'0.6rem', padding:'0.5rem 0.9rem' }}>+ Custom question</button>
        </div>
      </div>

=======
>>>>>>> 0535e7cc738eba828f46f7a78b8fc6434e5c1a86
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
