'use client'
import { useRouter } from 'next/navigation'
import PostForm from '@/components/ui/PostForm'

export default function NewPost() {
  const router = useRouter()
  const save = async (data: Record<string, unknown>) => {
    const res = await fetch('/api/posts', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error ?? 'Failed to create post')
  }
  return (
    <div style={{ maxWidth:820 }}>
      <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'2.5rem' }}>
        <button onClick={()=>router.back()} style={{ background:'none', border:'none', cursor:'pointer', fontFamily:'Inter,sans-serif', fontSize:'0.65rem', fontWeight:500, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--forest-500)', padding:0 }}>← Back</button>
        <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'2rem', fontWeight:300, color:'var(--forest-800)' }}>New Post</h1>
      </div>
      <PostForm onSave={save} />
    </div>
  )
}
