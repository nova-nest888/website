'use client'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import type { ServiceDoc } from '@/types'
import type { OfferingsContent } from '@/lib/siteContent.defaults'

/**
 * One page for every price on the site.
 * - Service prices (booking page + linked Experience cards) are saved on the service.
 * - Everything else ("in Nature" boxes, experiences with no service, group/tier prices)
 *   is saved on the Experiences content. Both are edited here so nothing hides in text.
 */
type Row = { key: string; label: string; hint?: string; value: number | undefined; set?: (v: number | undefined) => void; readOnlyNote?: string }

const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x))

export default function AdminPrices() {
  const [services, setServices]   = useState<ServiceDoc[] | null>(null)
  const [offerings, setOfferings] = useState<OfferingsContent | null>(null)
  const [orig, setOrig]           = useState<{ services: ServiceDoc[]; offerings: OfferingsContent } | null>(null)
  const [saving, setSaving]       = useState(false)
  const [message, setMessage]     = useState<{ ok: boolean; text: string } | null>(null)

  const load = async () => {
    const [sRes, cRes] = await Promise.all([fetch('/api/services'), fetch('/api/site-content')])
    const sJson = await sRes.json().catch(() => null)
    const cJson = await cRes.json().catch(() => null)
    if (!sRes.ok || !cRes.ok || !cJson?.data) { setMessage({ ok: false, text: 'Could not load prices.' }); return }
    const svc: ServiceDoc[] = Array.isArray(sJson?.data) ? sJson.data : []
    const off: OfferingsContent = cJson.data.content.offerings
    setServices(clone(svc)); setOfferings(clone(off)); setOrig({ services: clone(svc), offerings: clone(off) })
  }
  useEffect(() => { load() }, [])

  const dirtyServices  = useMemo(() => (services && orig) ? services.filter(s => JSON.stringify(s) !== JSON.stringify(orig.services.find(o => o.id === s.id))) : [], [services, orig])
  const dirtyOfferings = useMemo(() => (offerings && orig) ? JSON.stringify(offerings) !== JSON.stringify(orig.offerings) : false, [offerings, orig])
  const dirty = dirtyServices.length > 0 || dirtyOfferings

  const sections = useMemo(() => {
    if (!services || !offerings) return []
    const bySlug = new Map(services.map(s => [s.slug, s]))
    const upd = (fn: (o: OfferingsContent) => void) => setOfferings(prev => { const n = clone(prev!); fn(n); return n })
    const updSvc = (id: string, fn: (s: ServiceDoc) => void) => setServices(prev => prev!.map(s => { if (s.id !== id) return s; const n = clone(s); fn(n); return n }))

    const svcRows: Row[] = services.map(s => ({
      key: `svc-${s.id}`, label: s.title, hint: `${s.category} · ${s.duration} min · shown on the booking page${offerings.items.some(o => o.serviceSlug === s.slug) ? ' and the Experiences page' : ''}${s.isActive ? '' : ' · hidden'}`,
      value: s.price, set: v => updSvc(s.id, n => { n.price = v ?? 0 }),
    }))

    const choiceRows: Row[] = []
    services.forEach(s => (s.optionGroups ?? []).forEach((g, gi) => g.choices.forEach((c, ci) => {
      if (typeof c.price !== 'number') return
      choiceRows.push({ key: `opt-${s.id}-${gi}-${ci}`, label: `${s.title} › ${c.label}`, hint: g.label, value: c.price,
        set: v => updSvc(s.id, n => { const ch = n.optionGroups![gi].choices[ci]; if (v === undefined) delete ch.price; else ch.price = v }) })
    })))

    const expRows: Row[] = []
    offerings.items.forEach((o, i) => {
      if (o.tiers?.length || o.bullets?.length) return
      const linked = o.serviceSlug ? bySlug.get(o.serviceSlug) : undefined
      if (linked) {
        expRows.push({ key: `exp-${i}`, label: o.title, value: linked.price || undefined, readOnlyNote: `Price comes from the service "${linked.title}" (top section).` })
      } else {
        expRows.push({ key: `exp-${i}`, label: o.title, hint: `Shown as "From $X${o.priceUnit ?? ''}"`, value: o.priceAmount, set: v => upd(n => { n.items[i].priceAmount = v }) })
      }
    })

    const variantRows: Row[] = []
    offerings.items.forEach((o, i) => { if (o.variant) variantRows.push({ key: `var-${i}`, label: o.variant.title, hint: `Box under "${o.title}"`, value: o.variant.priceAmount, set: v => upd(n => { n.items[i].variant!.priceAmount = v }) }) })

    const tierRows: Row[] = []
    offerings.items.forEach((o, i) => o.tiers?.forEach((t, ti) => t.prices?.forEach((pl, pi) => {
      const linked = pl.serviceSlug ? bySlug.get(pl.serviceSlug) : undefined
      const label = `${o.title} › ${t.label} › ${pl.label}`
      if (linked) tierRows.push({ key: `tier-${i}-${ti}-${pi}`, label, value: linked.price || undefined, readOnlyNote: `Price comes from the service "${linked.title}" (top section).` })
      else tierRows.push({ key: `tier-${i}-${ti}-${pi}`, label, value: pl.amount, set: v => upd(n => { n.items[i].tiers[ti].prices![pi].amount = v }) })
    })))

    return [
      { title: 'Bookable services', note: 'These are the prices on the booking page. Linked Experience cards show the same number. Leave a service at 0 only if it is free.', rows: svcRows },
      { title: 'Price extras on booking options', note: 'Choices (e.g. Outdoor) that have their own "from" price. Add or remove choices in Admin → Services.', rows: choiceRows },
      { title: 'Experiences without a bookable service', note: 'Shown on the Experiences page as "From $X".', rows: expRows },
      { title: '"In Nature" and other second versions', note: '', rows: variantRows },
      { title: 'Group, team and tier prices', note: '', rows: tierRows },
    ].filter(sec => sec.rows.length > 0)
  }, [services, offerings])

  const save = async () => {
    setSaving(true); setMessage(null)
    try {
      for (const s of dirtyServices) {
        const res = await fetch(`/api/services/${s.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ price: Number(s.price) || 0, optionGroups: s.optionGroups ?? [] }) })
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? `Could not save "${s.title}"`)
      }
      if (dirtyOfferings) {
        const res = await fetch('/api/site-content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'offerings', data: offerings }) })
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? 'Could not save experience prices')
      }
      setMessage({ ok: true, text: 'Saved — prices are live on the site.' })
      await load()
    } catch (e) {
      setMessage({ ok: false, text: e instanceof Error ? e.message : 'Could not save.' })
    }
    setSaving(false)
  }

  return (
    <div style={{ maxWidth: 820 }}>
      <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: '2.2rem', fontWeight: 300, color: 'var(--forest-800)', marginBottom: '0.25rem' }}>Prices</h1>
      <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
        Every price on the website, in one place (US dollars). Change a number, press Save, and it updates the booking page and the Experiences page.
        To add a new service or edit its details, use <Link href="/admin/services" style={{ color: 'var(--forest-600)' }}>Services</Link>;
        to edit the wording around a price, use <Link href="/admin/content" style={{ color: 'var(--forest-600)' }}>Site Content</Link>.
      </p>

      {!services || !offerings ? (
        <div style={{ padding: '3rem', fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--text-ghost)' }}>{message?.ok === false ? message.text : 'Loading…'}</div>
      ) : (
        <>
          {sections.map(sec => (
            <div key={sec.title} style={{ marginBottom: '2rem' }}>
              <div style={{ fontFamily: 'Inter,sans-serif', fontSize: '0.64rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--forest-600)', marginBottom: '0.3rem' }}>{sec.title}</div>
              {sec.note && <div style={{ fontFamily: 'Inter,sans-serif', fontSize: '0.72rem', color: 'var(--text-ghost)', lineHeight: 1.6, marginBottom: '0.7rem' }}>{sec.note}</div>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {sec.rows.map(r => (
                  <div key={r.key} style={{ background: 'white', padding: '1rem 1.4rem', display: 'grid', gridTemplateColumns: '1fr 150px', gap: '1.2rem', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontFamily: 'Inter,sans-serif', fontSize: '0.88rem', fontWeight: 600, color: 'var(--forest-800)' }}>{r.label}</div>
                      {(r.hint || r.readOnlyNote) && <div style={{ fontFamily: 'Inter,sans-serif', fontSize: '0.7rem', color: 'var(--text-ghost)', marginTop: '0.2rem', lineHeight: 1.5 }}>{r.readOnlyNote ?? r.hint}</div>}
                    </div>
                    {r.set ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontFamily: 'Inter,sans-serif', color: 'var(--text-muted)' }}>$</span>
                        <input type="number" min={0} step={5} className="field-input" value={r.value ?? ''} placeholder="not set"
                          onChange={e => r.set!(e.target.value === '' ? undefined : Number(e.target.value))} />
                      </div>
                    ) : (
                      <div style={{ fontFamily: 'Inter,sans-serif', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{r.value ? `$${r.value}` : 'not set'}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div style={{ position: 'sticky', bottom: 0, background: 'var(--parchment)', padding: '1rem 0', display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap', borderTop: '1px solid var(--border)' }}>
            <button onClick={save} disabled={saving || !dirty} className="btn btn-forest" style={{ opacity: dirty ? 1 : 0.45 }}>{saving ? 'Saving…' : 'Save prices'}</button>
            {dirty && <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '0.72rem', color: 'var(--gold-dark)' }}>Unsaved changes</span>}
            {message && <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '0.76rem', color: message.ok ? 'var(--forest-500)' : '#c0392b' }}>{message.ok ? '✓ ' : ''}{message.text}</span>}
          </div>
        </>
      )}
    </div>
  )
}
