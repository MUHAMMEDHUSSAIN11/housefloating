import LoginModal from './components/Modals/LoginModal'
import RegisterModal from './components/Modals/RegisterModal'
import Navbar from './components/Navbar/Navbar'
import './globals.css'
import { Inter } from 'next/font/google'
import ToasterProvider from './providers/ToasterProvider'
import RentModal from './components/Modals/RentModal'


export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})


export const metadata = {
  title: 'Alleppey Houseboats-Online Booking',
  description: 'Book your Houseboat now',
}

export default async function RootLayout({ children, }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <ToasterProvider />
         <Navbar/> 
        <LoginModal />
        <RegisterModal />
        <RentModal />
        {children}
      </body>
    </html>
  )
}
