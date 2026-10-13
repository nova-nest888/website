'use client'
import React from 'react'

/**
 * Small schema-driven form used by Admin → Site Content.
 * A schema describes the fields; the editor renders inputs, repeatable lists
 * (add / remove / reorder) and nested groups, and reports the updated object.
 */
export type Field =
  | { key: string; label: string; type: 'text' | 'textarea'; help?: string; rows?: number }
  | { key: string; label: string; type: 'number'; help?: string }
  | { key: string; label: string; type: 'select'; options: string[]; help?: string }
  | { key: string; label: string; type: 'strings'; help?: string; addLabel?: string }
  | { key: string; label: string; type: 'list'; itemLabel: string; titleKey: string; fields: Field[]; blank: () => unknown; help?: string }
  | { key: string; label: string; type: 'object'; fields: Field[]; optional?: boolean; blank?: () => unknown; help?: string }

type Obj = Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any

const helpStyle: React.CSSProperties = { fontFamily: 'Inter,sans-serif', fontSize: '0.66rem', color: 'var(--text-ghost)', lineHeight: 1.55, marginTop: '0.3rem' }
const miniBtn: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: '0.66rem', fontWeight: 600, padding: '0.2rem 0.4rem' }

function move<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr
  const copy = [...arr]; const [x] = copy.splice(from, 1); copy.splice(to, 0, x); return copy
}

function FieldEditor({ field, value, onChange }: { field: Field; value: any; onChange: (v: any) => void }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  switch (field.type) {
    case 'text':
      return (
        <div>
          <label className="field-label">{field.label}</label>
          <input type="text" className="field-input" value={value ?? ''} onChange={e => onChange(e.target.value)} />
          {field.help && <div style={helpStyle}>{field.help}</div>}
        </div>
      )
    case 'textarea':
      return (
        <div>
          <label className="field-label">{field.label}</label>
          <textarea className="field-input" rows={field.rows ?? 3} style={{ resize: 'vertical' }} value={value ?? ''} onChange={e => onChange(e.target.value)} />
          {field.help && <div style={helpStyle}>{field.help}</div>}
        </div>
      )
    case 'number':
      return (
        <div>
          <label className="field-label">{field.label}</label>
          <input type="number" min={0} className="field-input" value={value ?? ''} onChange={e => onChange(e.target.value === '' ? undefined : Number(e.target.value))} />
          {field.help && <div style={helpStyle}>{field.help}</div>}
        </div>
      )
    case 'select':
      return (
        <div>
          <label className="field-label">{field.label}</label>
          <select className="field-input" value={value ?? field.options[0]} onChange={e => onChange(e.target.value)} style={{ cursor: 'pointer' }}>
            {field.options.map(o => <option key={o}>{o}</option>)}
          </select>
          {field.help && <div style={helpStyle}>{field.help}</div>}
        </div>
      )
    case 'strings': {
      const arr: string[] = Array.isArray(value) ? value : []
      return (
        <div>
          <label className="field-label">{field.label}</label>
          {arr.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem', alignItems: 'flex-start' }}>
              <textarea className="field-input" rows={2} style={{ resize: 'vertical', flex: 1 }} value={s} onChange={e => onChange(arr.map((x, j) => j === i ? e.target.value : x))} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <button type="button" style={{ ...miniBtn, color: 'var(--forest-500)' }} onClick={() => onChange(move(arr, i, i - 1))} aria-label="Move up">↑</button>
                <button type="button" style={{ ...miniBtn, color: 'var(--forest-500)' }} onClick={() => onChange(move(arr, i, i + 1))} aria-label="Move down">↓</button>
                <button type="button" style={{ ...miniBtn, color: '#c0392b' }} onClick={() => onChange(arr.filter((_, j) => j !== i))} aria-label="Remove">✕</button>
              </div>
            </div>
          ))}
          <button type="button" style={{ ...miniBtn, color: 'var(--forest-600)' }} onClick={() => onChange([...arr, ''])}>+ {field.addLabel ?? 'Add line'}</button>
          {field.help && <div style={helpStyle}>{field.help}</div>}
        </div>
      )
    }
    case 'list': {
      const arr: Obj[] = Array.isArray(value) ? value : []
      return (
        <div>
          <label className="field-label">{field.label}</label>
          {field.help && <div style={{ ...helpStyle, marginBottom: '0.6rem' }}>{field.help}</div>}
          {arr.map((item, i) => (
            <details key={i} style={{ background: 'var(--parchment-mid)', marginBottom: '0.5rem', padding: '0.2rem 0.9rem' }}>
              <summary style={{ cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: '0.82rem', fontWeight: 600, color: 'var(--forest-800)', padding: '0.7rem 0', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ flex: 1 }}>{i + 1}. {String(item?.[field.titleKey] ?? '').slice(0, 70) || `(new ${field.itemLabel})`}</span>
              </summary>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.4rem 0 1rem' }}>
                <ObjectEditor fields={field.fields} value={item} onChange={v => onChange(arr.map((x, j) => j === i ? v : x))} />
                <div style={{ display: 'flex', gap: '0.8rem', borderTop: '1px solid var(--border)', paddingTop: '0.6rem' }}>
                  <button type="button" style={{ ...miniBtn, color: 'var(--forest-500)' }} onClick={() => onChange(move(arr, i, i - 1))}>↑ Move up</button>
                  <button type="button" style={{ ...miniBtn, color: 'var(--forest-500)' }} onClick={() => onChange(move(arr, i, i + 1))}>↓ Move down</button>
                  <button type="button" style={{ ...miniBtn, color: '#c0392b', marginLeft: 'auto' }}
                    onClick={() => { if (confirm(`Remove this ${field.itemLabel}?`)) onChange(arr.filter((_, j) => j !== i)) }}>Remove</button>
                </div>
              </div>
            </details>
          ))}
          <button type="button" className="btn btn-outline" style={{ fontSize: '0.6rem', padding: '0.5rem 0.9rem' }} onClick={() => onChange([...arr, field.blank()])}>+ Add {field.itemLabel}</button>
        </div>
      )
    }
    case 'object': {
      const enabled = value !== undefined && value !== null
      if (field.optional && !enabled) {
        return (
          <div>
            <label className="field-label">{field.label}</label>
            <button type="button" className="btn btn-outline" style={{ fontSize: '0.6rem', padding: '0.5rem 0.9rem' }} onClick={() => onChange(field.blank ? field.blank() : {})}>+ Add {field.label.toLowerCase()}</button>
            {field.help && <div style={helpStyle}>{field.help}</div>}
          </div>
        )
      }
      return (
        <fieldset style={{ border: '1px solid var(--border)', padding: '1.1rem 1.2rem 1.3rem', margin: 0 }}>
          <legend style={{ fontFamily: 'Inter,sans-serif', fontSize: '0.64rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--forest-600)', padding: '0 0.5rem' }}>{field.label}</legend>
          {field.help && <div style={{ ...helpStyle, marginTop: 0, marginBottom: '0.9rem' }}>{field.help}</div>}
          <ObjectEditor fields={field.fields} value={value ?? {}} onChange={onChange} />
          {field.optional && (
            <button type="button" style={{ ...miniBtn, color: '#c0392b', marginTop: '0.8rem' }} onClick={() => { if (confirm(`Remove ${field.label.toLowerCase()}?`)) onChange(undefined) }}>Remove {field.label.toLowerCase()}</button>
          )}
        </fieldset>
      )
    }
  }
}

export function ObjectEditor({ fields, value, onChange }: { fields: Field[]; value: Obj; onChange: (v: Obj) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
      {fields.map(f => (
        <FieldEditor key={f.key} field={f} value={value?.[f.key]} onChange={v => {
          const next = { ...(value ?? {}) }
          if (v === undefined) delete next[f.key]; else next[f.key] = v
          onChange(next)
        }} />
      ))}
    </div>
  )
}
