
import LoginModal from './components/Modals/LoginModal'
import RegisterModal from './components/Modals/RegisterModal'
import Navbar from './components/Navbar/Navbar'
import './globals.css'
import { Inter} from 'next/font/google'
import ToasterProvider from './providers/ToasterProvider'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import SessionProvider from './SessionProvider'



export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})
 


export const metadata = {
  title: 'Houseboats-Online Booking',
  description: 'Book your Houseboat now',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
 
  const getSession = await getServerSession(authOptions)
  return (
    <html lang="en">
      <body className={inter.className}>
       <ToasterProvider />
        <LoginModal />
        <RegisterModal />
        <Navbar />
        {children}
      </body>
    </html>
  )
}
