import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      trialEndsAt?: string
      subscriptionStatus?: string | null
      currentPeriodEnd?: string
    } & Session['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string
  }
}
