# Run locally

1. Install Node.js 20+ and have MongoDB available (local `mongod`, or a free MongoDB Atlas URI).
2. In this folder run:  `npm install`
3. Create a file named `.env.local` next to `package.json` (you likely already have one from before — reuse it):

       MONGODB_URI=mongodb://127.0.0.1:27017/novanest
       NEXTAUTH_SECRET=any-long-random-string
       NEXTAUTH_URL=http://localhost:3000
       # Optional, only if you use them: CLOUDINARY_*, RESEND_API_KEY, EMAIL_FROM, EMAIL_TO, UPSTASH_*

4. (First time only, to create the admin user/data) `npm run seed`
5. Start it:  `npm run dev`  → open http://localhost:3000
   Admin: http://localhost:3000/admin/login

# What's new
- /offerings → "Start with how you want to feel": each suggestion now scrolls to its experience.
- Admin → Settings → "Page Maintenance": switch any page (Home, Experiences, About, Gallery, Journal, Contact, Book) to show "This page is under maintenance", with an optional custom message.
