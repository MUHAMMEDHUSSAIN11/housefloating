import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import { firestore } from "@/app/firebase/clientApp";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { cert } from "firebase-admin/app";
import { Adapter } from "next-auth/adapters";


export const authOptions = {
  // Configure one or more authentication providers
  secret: 'Safe_quite_Belgium',
  providers: [
    GoogleProvider({
        clientId:"process.env.Google_Provider_Client_id",
        clientSecret:"process.env.Google_Provider_client_Secret",

      }),
  ],
  // adapter: FirestoreAdapter({
  //   credential: cert({
  //     projectId: process.env.project_id,
  //     clientEmail:process.env.client_email,
  //     privateKey:process.env.private_key.replace(/\\n/g, '\n'),
  //   }),
  // }) as Adapter
}

export default NextAuth(authOptions);