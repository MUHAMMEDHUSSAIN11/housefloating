import LoginModal from './components/Modals/LoginModal'
import RegisterModal from './components/Modals/RegisterModal'
import Navbar from './components/Navbar/Navbar'
import './globals.css'
import { Inter } from 'next/font/google'
import RentModal from './components/Modals/RentModal'
import NextTopLoader from 'nextjs-toploader';
import ScrollToTopButton from './components/Misc/ScrolltoTop'
import { Toaster } from 'react-hot-toast'

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload:true
})


export const metadata = {
  title: 'Alleppey Houseboats-Online Booking',
  description: 'Book your Houseboat online',
}

export default async function RootLayout({ children, }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
        <Navbar />
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
