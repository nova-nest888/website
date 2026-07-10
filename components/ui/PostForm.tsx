'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toSlug } from '@/lib/utils'
import type { PostDoc } from '@/types'

const CATEGORIES = ['nature','movement','presence','growth','community','immersion']

interface PostFormProps {
  initial?: Partial<PostDoc>
  onSave: (data: Record<string, unknown>) => Promise<void>
}

export default function PostForm({ initial = {}, onSave }: PostFormProps) {
  const router  = useRouter()
  const [form, setForm] = useState({
    title:     initial.title     ?? '',
    slug:      initial.slug      ?? '',
    excerpt:   initial.excerpt   ?? '',
    content:   initial.content   ?? '',
    category:  initial.category  ?? 'nature',
    published: initial.published ?? false,
    coverImage:initial.coverImage?? '',
  })
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')
  const [saved,  setSaved]  = useState(false)

  const set = (k: string, v: string | boolean) =>
    setForm(f => ({ ...f, [k]: v, ...(k === 'title' ? { slug: toSlug(v as string) } : {}) }))

  const submit = async () => {
    if (!form.title || !form.slug || !form.excerpt || !form.content) {
      setError('Title, slug, excerpt, and content are required.'); return
    }
    setSaving(true); setError('')
    try {
      await onSave(form)
      setSaved(true)
      setTimeout(() => router.push('/admin/posts'), 800)
    } catch (e: any) {
      setError(e.message ?? 'Could not save.'); setSaving(false)
    }
  }

  return (
    <div style={{ background:'white', padding:'2.5rem', display:'flex', flexDirection:'column', gap:'1.5rem' }}>
      <div>
        <label className="field-label">Title *</label>
        <input type="text" value={form.title} onChange={e=>set('title',e.target.value)} className="field-input" placeholder="Post title" style={{ fontSize:'1rem' }}/>
      </div>
      <div className="nn-rg-sm" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
        <div>
          <label className="field-label">URL Slug *</label>
          <input type="text" value={form.slug} onChange={e=>set('slug',e.target.value)} className="field-input" placeholder="post-slug"/>
          <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.62rem', color:'var(--text-ghost)', marginTop:'0.3rem' }}>/journal/{form.slug||'slug'}</div>
        </div>
        <div>
          <label className="field-label">Category</label>
          <select value={form.category} onChange={e=>set('category',e.target.value)} className="field-input" style={{ cursor:'pointer' }}>
            {CATEGORIES.map(c=><option key={c} value={c}>{c.replace(/-/g,' ').replace(/\b\w/g,l=>l.toUpperCase())}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="field-label">Cover Image URL <span style={{ fontWeight:400, textTransform:'none', letterSpacing:0, fontSize:'0.65rem', color:'var(--text-ghost)' }}>(optional)</span></label>
        <input type="url" value={form.coverImage} onChange={e=>set('coverImage',e.target.value)} className="field-input" placeholder="https://..."/>
      </div>
      <div>
        <label className="field-label">Excerpt * <span style={{ fontWeight:400, textTransform:'none', letterSpacing:0, fontSize:'0.65rem', color:'var(--text-ghost)' }}>— 2–3 sentences shown on the journal listing</span></label>
        <textarea value={form.excerpt} onChange={e=>set('excerpt',e.target.value)} rows={3} className="field-input" style={{ resize:'vertical' }} placeholder="A short, honest preview that draws someone in."/>
      </div>
      <div>
        <label className="field-label">Content * <span style={{ fontWeight:400, textTransform:'none', letterSpacing:0, fontSize:'0.65rem', color:'var(--text-ghost)' }}>— HTML supported: &lt;p&gt; &lt;h2&gt; &lt;em&gt; &lt;strong&gt; &lt;ul&gt; &lt;li&gt;</span></label>
        <textarea value={form.content} onChange={e=>set('content',e.target.value)} rows={22} className="field-input" style={{ resize:'vertical', fontFamily:'monospace', fontSize:'0.84rem', lineHeight:1.7 }} placeholder={`<p>Your post content here.</p>\n\n<p>Use &lt;p&gt; for paragraphs, &lt;h2&gt; for section headings.</p>`}/>
        <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.62rem', color:'var(--text-ghost)', marginTop:'0.3rem' }}>{form.content.length.toLocaleString()} characters</div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:'0.7rem', padding:'0.8rem 1rem', background:'var(--parchment-mid)' }}>
        <input type="checkbox" id="pub" checked={form.published} onChange={e=>set('published',e.target.checked)} style={{ accentColor:'var(--forest-600)', width:16, height:16 }}/>
        <label htmlFor="pub" style={{ fontFamily:'Inter,sans-serif', fontSize:'0.85rem', color:'var(--text-body)', cursor:'pointer' }}>
          Publish immediately <span style={{ color:'var(--text-ghost)', fontSize:'0.76rem' }}>(unchecked = draft)</span>
        </label>
      </div>
      {error && <div style={{ padding:'0.8rem 1rem', background:'#fef2f2', border:'1px solid #fecaca', fontFamily:'Inter,sans-serif', fontSize:'0.8rem', color:'#c0392b' }}>{error}</div>}
      <div style={{ display:'flex', gap:'1rem', alignItems:'center' }}>
        <button onClick={submit} disabled={saving} className="btn btn-forest">{saving ? 'Saving…' : form.published ? 'Publish Post' : 'Save as Draft'}</button>
        <button onClick={()=>router.back()} className="btn btn-outline">Cancel</button>
        {saved && <span style={{ fontFamily:'Inter,sans-serif', fontSize:'0.76rem', color:'var(--forest-500)' }}>✓ Saved</span>}
      </div>
    </div>
  )
}
