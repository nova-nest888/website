'use client'
import { useEffect, useMemo, useState } from 'react'
import { ObjectEditor, type Field } from '@/components/admin/SchemaEditor'
import { HOME_SCHEMA, ABOUT_SCHEMA, OFFERINGS_SCHEMA, CONTACT_SCHEMA } from '@/lib/contentSchemas'
import type { SiteContent, SiteContentSection } from '@/lib/siteContent.defaults'

const TABS: { key: SiteContentSection; label: string; path: string; schema: Field[]; blurb: string }[] = [
  { key: 'home',      label: 'Home',      path: '/',          schema: HOME_SCHEMA,      blurb: 'Headline, intro, "ways to join" cards and the bottom call-to-action. Testimonials are managed in Admin → Testimonials; the hero photo is changed on the Home page itself while logged in.' },
  { key: 'about',     label: 'About',     path: '/about',     schema: ABOUT_SCHEMA,     blurb: 'Your story, philosophy, the three pillars, timeline and "who this is for". The portrait photo is changed on the About page itself while logged in.' },
  { key: 'offerings', label: 'Offerings', path: '/offerings', schema: OFFERINGS_SCHEMA, blurb: 'Every experience card: text, lists, "in Nature" versions, layout. Prices come from Admin → Services (linked by service slug), so you only change a price in one place. Card photos are changed on the Offerings page itself while logged in.' },
  { key: 'contact',   label: 'Contact',   path: '/contact',   schema: CONTACT_SCHEMA,   blurb: 'Page header, contact details, social media QR codes (upload one image per account), the booking box and the message-form choices.' },
]

export default function AdminContent() {
  const [content, setContent]       = useState<SiteContent | null>(null)
  const [customized, setCustomized] = useState<string[]>([])
  const [tab, setTab]               = useState<SiteContentSection>('home')
  const [draft, setDraft]           = useState<Record<string, any> | null>(null) // eslint-disable-line @typescript-eslint/no-explicit-any
  const [dirty, setDirty]           = useState(false)
  const [saving, setSaving]         = useState(false)
  const [message, setMessage]       = useState<{ ok: boolean; text: string } | null>(null)

  const load = async (nextTab: SiteContentSection = tab) => {
    const res  = await fetch('/api/site-content')
    const json = await res.json().catch(() => null)
    if (!res.ok || !json?.data) { setMessage({ ok: false, text: json?.error ?? 'Could not load content.' }); return }
    setContent(json.data.content); setCustomized(json.data.customized)
    setDraft(JSON.parse(JSON.stringify(json.data.content[nextTab]))); setDirty(false)
  }
  useEffect(() => { load('home') }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const current = useMemo(() => TABS.find(t => t.key === tab)!, [tab])

  const switchTab = (k: SiteContentSection) => {
    if (dirty && !confirm('You have unsaved changes in this tab. Discard them?')) return
    setTab(k); setMessage(null)
    if (content) { setDraft(JSON.parse(JSON.stringify(content[k]))); setDirty(false) }
  }

  const save = async () => {
    if (!draft) return
    setSaving(true); setMessage(null)
    const res  = await fetch('/api/site-content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: tab, data: draft }) })
    const json = await res.json().catch(() => ({}))
    setSaving(false)
    if (!res.ok) { setMessage({ ok: false, text: json.error ?? 'Could not save.' }); return }
    setMessage({ ok: true, text: 'Saved — the live page is updated.' })
    await load(tab)
  }

  const reset = async () => {
    if (!confirm(`Reset the ${current.label} page text to the original wording? Your edits to this page will be lost.`)) return
    setSaving(true)
    const res = await fetch('/api/site-content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: tab, data: null }) })
    setSaving(false)
    setMessage(res.ok ? { ok: true, text: 'Reset to the original wording.' } : { ok: false, text: 'Could not reset.' })
    await load(tab)
  }

  return (
    <div style={{ maxWidth: 820 }}>
      <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: '2.2rem', fontWeight: 300, color: 'var(--forest-800)', marginBottom: '0.25rem' }}>Site Content</h1>
      <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Edit the wording of the public pages. Changes go live as soon as you save.
      </p>

      <div style={{ display: 'flex', gap: '2px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => switchTab(t.key)} style={{
            padding: '0.8rem 1.6rem', border: 'none', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
            background: tab === t.key ? 'var(--forest-800)' : 'white', color: tab === t.key ? 'var(--parchment)' : 'var(--forest-700)',
          }}>
            {t.label}{customized.includes(t.key) && <span style={{ color: 'var(--gold)', marginLeft: '0.4rem' }} title="Edited">●</span>}
          </button>
        ))}
      </div>

      <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>{current.blurb}</p>

      {!draft ? (
        <div style={{ padding: '3rem', fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--text-ghost)' }}>{message?.ok === false ? message.text : 'Loading…'}</div>
      ) : (
        <>
          <div style={{ background: 'white', padding: '2rem' }}>
            <ObjectEditor fields={current.schema} value={draft} onChange={v => { setDraft(v); setDirty(true); setMessage(null) }} />
          </div>

          <div style={{ position: 'sticky', bottom: 0, background: 'var(--parchment)', padding: '1rem 0', marginTop: '1rem', display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap', borderTop: '1px solid var(--border)' }}>
            <button onClick={save} disabled={saving || !dirty} className="btn btn-forest" style={{ opacity: dirty ? 1 : 0.45 }}>{saving ? 'Saving…' : 'Save changes'}</button>
            <a href={current.path} target="_blank" rel="noopener" className="btn btn-outline" style={{ fontSize: '0.65rem' }}>View page ↗</a>
            {customized.includes(tab) && <button onClick={reset} disabled={saving} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: '0.68rem', color: '#c0392b', textDecoration: 'underline' }}>Reset to original wording</button>}
            {dirty && <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '0.72rem', color: 'var(--gold-dark)' }}>Unsaved changes</span>}
            {message && <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '0.76rem', color: message.ok ? 'var(--forest-500)' : '#c0392b' }}>{message.ok ? '✓ ' : ''}{message.text}</span>}
          </div>
        </>
      )}
    </div>
  )
}
