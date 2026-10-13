'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ServiceForm from '@/components/ui/ServiceForm'
import type { ServiceDoc } from '@/types'

export default function EditService({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [id, setId]           = useState('')
  const [service, setService] = useState<ServiceDoc | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    params.then(p => {
      setId(p.id)
      fetch('/api/services')
        .then(r => r.json())
        .then(d => {
          const found = (d.data ?? []).find((s: ServiceDoc) => s.id === p.id)
          setService(found ?? null)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    })
  }, [params])

  const save = async (data: Record<string, unknown>) => {
    const res = await fetch(`/api/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error ?? 'Failed to save')
  }

  if (loading) return <div style={{ padding:'3rem', fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.2rem', fontStyle:'italic', color:'var(--text-ghost)' }}>Loading…</div>
  if (!service) return <div style={{ padding:'3rem', fontFamily:'Inter,sans-serif', fontSize:'0.9rem', color:'#c0392b' }}>Service not found.</div>

  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'2.5rem' }}>
        <button onClick={() => router.back()} style={{ background:'none', border:'none', cursor:'pointer', fontFamily:'Inter,sans-serif', fontSize:'0.65rem', fontWeight:500, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--forest-500)', padding:0 }}>← Back</button>
        <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'2rem', fontWeight:300, color:'var(--forest-800)' }}>Edit Service</h1>
      </div>
      <ServiceForm initial={service} onSave={save} />
    </div>
  )
}
