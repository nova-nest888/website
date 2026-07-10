import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM    = process.env.EMAIL_FROM ?? 'NovaNest <hello@novanest.com>'
const TO      = process.env.EMAIL_TO   ?? 'admin@novanest.com'
const SITEURL = process.env.NEXTAUTH_URL ?? 'https://novanest.com'

// ─── Contact form notification ─────────────────────────────────────────────────
export async function sendContactNotification(data: {
  name: string; email: string; phone?: string
  interest?: string; how?: string; message: string
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — skipping email')
    return
  }
  await resend.emails.send({
    from: FROM,
    to:   TO,
    replyTo: data.email,
    subject: `New message from ${data.name} — NovaNest`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1C2B1A">
        <div style="background:#2D3D2A;padding:2rem;color:#F0EDE6">
          <h1 style="margin:0;font-weight:300;font-size:1.5rem">Nova<em>Nest</em></h1>
          <p style="margin:0.5rem 0 0;font-family:sans-serif;font-size:0.75rem;letter-spacing:0.15em;opacity:0.7">NEW CONTACT FORM SUBMISSION</p>
        </div>
        <div style="padding:2rem;background:#F0EDE6;border:1px solid #DDD8CE">
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:0.5rem 0;font-family:sans-serif;font-size:0.75rem;font-weight:600;letter-spacing:0.1em;color:#8B7355;width:120px">NAME</td><td style="padding:0.5rem 0">${data.name}</td></tr>
            <tr><td style="padding:0.5rem 0;font-family:sans-serif;font-size:0.75rem;font-weight:600;letter-spacing:0.1em;color:#8B7355">EMAIL</td><td style="padding:0.5rem 0"><a href="mailto:${data.email}" style="color:#3D5232">${data.email}</a></td></tr>
            ${data.phone    ? `<tr><td style="padding:0.5rem 0;font-family:sans-serif;font-size:0.75rem;font-weight:600;letter-spacing:0.1em;color:#8B7355">PHONE</td><td style="padding:0.5rem 0">${data.phone}</td></tr>` : ''}
            ${data.interest ? `<tr><td style="padding:0.5rem 0;font-family:sans-serif;font-size:0.75rem;font-weight:600;letter-spacing:0.1em;color:#8B7355">INTEREST</td><td style="padding:0.5rem 0">${data.interest}</td></tr>` : ''}
            ${data.how      ? `<tr><td style="padding:0.5rem 0;font-family:sans-serif;font-size:0.75rem;font-weight:600;letter-spacing:0.1em;color:#8B7355">FOUND US</td><td style="padding:0.5rem 0">${data.how}</td></tr>` : ''}
          </table>
          <div style="margin-top:1.5rem;padding:1.5rem;background:white;border-left:3px solid #8B7355">
            <p style="margin:0;line-height:1.8;font-size:1rem">${data.message.replace(/\n/g, '<br/>')}</p>
          </div>
          <div style="margin-top:1.5rem">
            <a href="mailto:${data.email}?subject=Re: Your message to NovaNest" style="display:inline-block;background:#2D3D2A;color:#F0EDE6;padding:0.75rem 1.5rem;font-family:sans-serif;font-size:0.75rem;font-weight:600;letter-spacing:0.12em;text-decoration:none">REPLY TO ${data.name.toUpperCase()}</a>
          </div>
        </div>
      </div>
    `,
  })
}

// ─── Contact auto-reply ────────────────────────────────────────────────────────
export async function sendContactAutoReply(data: { name: string; email: string }) {
  if (!process.env.RESEND_API_KEY) return
  await resend.emails.send({
    from:    FROM,
    to:      data.email,
    subject: 'Your message to NovaNest',
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1C2B1A">
        <div style="background:#2D3D2A;padding:2rem;color:#F0EDE6">
          <h1 style="margin:0;font-weight:300;font-size:1.5rem">Nova<em>Nest</em></h1>
          <p style="margin:0.5rem 0 0;font-family:sans-serif;font-size:0.75rem;letter-spacing:0.15em;opacity:0.7">A NEW WAY OF LIVING</p>
        </div>
        <div style="padding:2rem;background:#F0EDE6;border:1px solid #DDD8CE">
          <p style="font-size:1.1rem;margin:0 0 1rem">Hi ${data.name},</p>
          <p style="line-height:1.8;margin:0 0 1rem">Thank you for reaching out. Your message has landed safely and I'll be in touch within 1–2 business days.</p>
          <p style="line-height:1.8;margin:0 0 2rem;color:#6B7D68">In the meantime, feel free to explore the offerings or follow along on Instagram at <a href="https://instagram.com/novanest_777" style="color:#3D5232">@novanest_777</a>.</p>
          <a href="${SITEURL}/offerings" style="display:inline-block;background:#2D3D2A;color:#F0EDE6;padding:0.75rem 1.5rem;font-family:sans-serif;font-size:0.75rem;font-weight:600;letter-spacing:0.12em;text-decoration:none">EXPLORE OFFERINGS</a>
          <p style="margin:2rem 0 0;font-style:italic;color:#8B7355;font-size:0.9rem">A new way of living.</p>
        </div>
      </div>
    `,
  })
}
