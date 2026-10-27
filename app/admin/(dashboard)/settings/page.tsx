'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

const MAINT_PAGES = [
  { key: 'home', label: 'Home' }, { key: 'offerings', label: 'Experiences' }, { key: 'about', label: 'About' },
  { key: 'gallery', label: 'Gallery' }, { key: 'journal', label: 'Journal' }, { key: 'contact', label: 'Contact' }, { key: 'book', label: 'Book' },
]
type Maint = Record<string, { enabled: boolean; message: string }>

function MaintenanceSection() {
  const [state, setState] = useState<Maint | null>(null)
  const [busy, setBusy]   = useState<string | null>(null)
  const [note, setNote]   = useState('')

  useEffect(() => {
    fetch('/api/admin/maintenance').then(r => r.json()).then(j => setState(j.data?.maintenance ?? {})).catch(() => setState({}))
  }, [])

  const save = async (key: string, next: { enabled: boolean; message: string }) => {
    setBusy(key); setNote('')
    try {
      const res = await fetch('/api/admin/maintenance', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: key, ...next }),
      })
      if (!res.ok) throw new Error()
      setNote('Saved.')
    } catch { setNote('Could not save. Try again.') }
    finally { setBusy(null) }
  }
  const update = (key: string, patch: Partial<{ enabled: boolean; message: string }>) =>
    setState(s => ({ ...(s ?? {}), [key]: { enabled: false, message: '', ...(s?.[key] ?? {}), ...patch } }))

  return (
    <div style={{ background:'white', padding:'2.5rem', marginTop:'2rem' }}>
      <div className="overline" style={{ color:'var(--text-ghost)', marginBottom:'0.6rem' }}>Page Maintenance</div>
      <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.8rem', color:'var(--text-muted)', lineHeight:1.6, marginBottom:'1.5rem' }}>
        Turn a page on to show visitors a “This page is under maintenance” notice instead of its content. The rest of the site keeps working.
      </p>
      {!state ? <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.8rem', color:'var(--text-muted)' }}>Loading…</div> : (
        <div style={{ display:'flex', flexDirection:'column' }}>
          {MAINT_PAGES.map(p => {
            const cur = state[p.key] ?? { enabled: false, message: '' }
            return (
              <div key={p.key} style={{ padding:'1rem 0', borderTop:'1px solid var(--border)' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem' }}>
                  <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.88rem', color:'var(--forest-800)' }}>
                    {p.label}
                    {cur.enabled && <span style={{ marginLeft:'0.6rem', fontSize:'0.62rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'#b45309' }}>Under maintenance</span>}
                  </div>
                  <label style={{ display:'flex', alignItems:'center', gap:'0.5rem', fontFamily:'Inter,sans-serif', fontSize:'0.75rem', color:'var(--text-muted)', cursor:'pointer' }}>
                    <input type="checkbox" checked={cur.enabled} disabled={busy === p.key}
                      onChange={e => { update(p.key, { enabled: e.target.checked }); save(p.key, { enabled: e.target.checked, message: cur.message }) }} />
                    Maintenance mode
                  </label>
                </div>
                {cur.enabled && (
                  <div style={{ marginTop:'0.8rem', display:'flex', gap:'0.6rem', alignItems:'flex-start' }}>
                    <input className="field-input" style={{ flex:1 }} maxLength={500} value={cur.message}
                      placeholder="Optional message (default: We're making a few improvements here…)"
                      onChange={e => update(p.key, { message: e.target.value })} />
                    <button className="btn btn-outline" style={{ fontSize:'0.65rem' }} disabled={busy === p.key}
                      onClick={() => save(p.key, cur)}>Save message</button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
      {note && <div style={{ marginTop:'1rem', fontFamily:'Inter,sans-serif', fontSize:'0.78rem', color:'var(--forest-700)' }}>{note}</div>}
    </div>
  )
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const [form, setForm]     = useState({ currentPassword:'', newPassword:'', confirmPassword:'' })
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')
  const [done,   setDone]   = useState(false)

  const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setError(''); setDone(false) }

  const submit = async () => {
    if (!form.currentPassword || !form.newPassword) { setError('Fill in both password fields.'); return }
    if (form.newPassword.length < 8) { setError('New password must be at least 8 characters.'); return }
    if (form.newPassword !== form.confirmPassword) { setError("New password and confirmation don't match."); return }

    setSaving(true); setError('')
    try {
      const res = await fetch('/api/admin/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Could not update password.')
      setDone(true)
      setForm({ currentPassword:'', newPassword:'', confirmPassword:'' })
    } catch (e: any) {
      setError(e.message ?? 'Could not update password.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: 520 }}>
      <div style={{ marginBottom:'2.5rem' }}>
        <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'2rem', fontWeight:300, color:'var(--forest-800)' }}>Settings</h1>
        <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.85rem', color:'var(--text-muted)', marginTop:'0.3rem' }}>
          Signed in as {session?.user?.email}
        </p>
      </div>

      <div style={{ background:'white', padding:'2.5rem', display:'flex', flexDirection:'column', gap:'1.5rem' }}>
        <div>
          <div className="overline" style={{ color:'var(--text-ghost)', marginBottom:'1.2rem' }}>Change Password</div>

          <div style={{ display:'flex', flexDirection:'column', gap:'1.2rem' }}>
            <div>
              <label className="field-label">Current Password</label>
              <input
                type="password" autoComplete="current-password"
                value={form.currentPassword} onChange={e => set('currentPassword', e.target.value)}
                className="field-input" placeholder="Your current password"
              />
            </div>
            <div>
              <label className="field-label">New Password</label>
              <input
                type="password" autoComplete="new-password"
                value={form.newPassword} onChange={e => set('newPassword', e.target.value)}
                className="field-input" placeholder="At least 8 characters"
              />
            </div>
            <div>
              <label className="field-label">Confirm New Password</label>
              <input
                type="password" autoComplete="new-password"
                value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)}
                className="field-input" placeholder="Type it again"
              />
            </div>
          </div>
        </div>

        {error && (
          <div style={{ padding:'0.8rem 1rem', background:'#fef2f2', border:'1px solid #fecaca', fontFamily:'Inter,sans-serif', fontSize:'0.8rem', color:'#c0392b' }}>
            {error}
          </div>
        )}
        {done && (
          <div style={{ padding:'0.8rem 1rem', background:'#f0f9f0', border:'1px solid #bfe3bf', fontFamily:'Inter,sans-serif', fontSize:'0.8rem', color:'var(--forest-700)' }}>
            Password updated. Use it next time you sign in — your current session stays active.
          </div>
        )}

        <div>
          <button
            onClick={submit}
            disabled={saving || !form.currentPassword || !form.newPassword}
            className="btn btn-forest"
            style={{ opacity: (!form.currentPassword || !form.newPassword) ? 0.4 : 1 }}
          >
            {saving ? 'Updating…' : 'Update Password'}
          </button>
        </div>
      </div>

      <MaintenanceSection />
    </div>
  )
}
