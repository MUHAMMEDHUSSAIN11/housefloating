import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.Google_Provider_Client_id!,
            clientSecret: process.env.Google_Provider_client_Secret!,
        }),
    ],
    pages: {
        signIn: '/',
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, account, profile }) {
            if (account) {
                token.accessToken = account.access_token
                token.idToken = account.id_token
                token.id = profile?.sub
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id as string
                (session.user as any).idToken = token.idToken as string
            }
            return session
        },
    },
})

export { handler as GET, handler as POST }
