import LoginModal from './components/Modals/LoginModal'
import RegisterModal from './components/Modals/RegisterModal'
import Navbar from './components/Navbar/Navbar'
import './globals.css'
import { Inter } from 'next/font/google'

import RentModal from './components/Modals/RentModal'
import NextTopLoader from 'nextjs-toploader';
import SonnerToastProvider from './providers/SonnerToastProvider'
import ScrollToTopButton from './components/Misc/ScrolltoTop'



export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})


export const metadata = {
  title: 'Alleppey Houseboats-Online Booking',
  description: 'Book your Houseboat online',
}

export default async function RootLayout({ children, }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <SonnerToastProvider />
         <Navbar/> 
        <LoginModal />
        <RegisterModal />
        <RentModal />
        <NextTopLoader color="#3b82f6" height={4} showSpinner={false} />
        <ScrollToTopButton />
        {children}
      </body>
    </html>
  )
}
