'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

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
    </div>
  )
}
