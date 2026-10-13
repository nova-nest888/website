import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { connectDB } from './mongoose'
import { User } from './models/User'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        try {
          await connectDB()
          // Explicitly select password (it has select: false on the schema)
          const user = await User.findOne({ email: credentials.email.toLowerCase() }).select('+password')
          if (!user) return null
          const valid = await bcrypt.compare(credentials.password, user.password)
          if (!valid) return null
          return { id: user._id.toString(), email: user.email, name: user.name ?? null }
        } catch {
          return null
        }
      },
    }),
  ],
  session: { strategy: 'jwt', maxAge: 24 * 60 * 60 }, // 24h
  jwt:     { maxAge: 24 * 60 * 60 },
  pages:   { signIn: '/admin/login' },
  secret:  process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        (session.user as any).id = token.id
      }
      return session
    },
  },
}
