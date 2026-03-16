import LoginModal from './components/Modals/LoginModal'
import RegisterModal from './components/Modals/RegisterModal'
import Navbar from './components/Navbar/Navbar'
import './globals.css'
import { Inter } from 'next/font/google'
import { GoogleTagManager } from '@next/third-parties/google'
import NextTopLoader from 'nextjs-toploader';
import ScrollToTopButton from './components/Misc/ScrolltoTop'
import { Toaster } from 'react-hot-toast'
import GTMTracker from './actions/GtmTralker/gtmTracker'
import Script from 'next/script'
import BottomNavbar from './components/BottomNavbar/BottomNavbar'
import GoogleSync from './components/Auth/GoogleSync'
import { Suspense } from 'react'

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true
})


export const metadata = {
  metadataBase: new URL('https://housefloating.com'),
  title: 'Housefloating.com - Book Houseboats in Alleppey',
  description: "Housefloating.com is the #1 portal to book luxury Alleppey houseboats at best prices. Experience premium Kerala houseboats and unforgettable journeys online.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/images/hf-Logo.jpg", sizes: "32x32", type: "image/jpeg" },
      { url: "/images/hf-Logo.jpg", sizes: "48x48", type: "image/jpeg" },
      { url: "/images/hf-Logo.jpg", sizes: "96x96", type: "image/jpeg" },
      { url: "/images/hf-Logo.jpg", sizes: "144x144", type: "image/jpeg" },
      { url: "/images/hf-Logo.jpg", sizes: "192x192", type: "image/jpeg" },
    ],
    shortcut: "/images/hf-Logo.jpg",
    apple: "/images/hf-Logo.jpg",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Housefloating.com - Book Houseboats in Alleppey',
    description: 'Book your Alleppey houseboat online and experience luxury and premium Kerala houseboats.',
    images: ['/images/hf-Logo.jpg'],
  },
  openGraph: {
    title: 'Housefloating.com - Book Houseboats in Alleppey',
    description: "Housefloating is No #1 Online portal for Booking Houseboats in Alleppey. Book your Alleppey houseboat online and experience luxury and premium Kerala houseboats. Affordable rates and unforgettable journeys await you!",
    images: ['/images/hf-Logo.jpg']
  },
}

export const viewport = {
  themeColor: "#3b82f6",
}

import StoreProvider from './StoreProvider';

export default async function RootLayout({ children, }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <head>
      </head>

      <GoogleTagManager gtmId="GTM-PDC8KBVM" />
      
      {/* Google Ads Global Site Tag */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=AW-17980296798"
      />
      <Script
        id="google-ads-tag"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17980296798');
          `,
        }}
      />

      <body className={inter.className}>
        <Suspense fallback={null}>
          <GTMTracker />
        </Suspense>

        <Toaster
          position="top-center"
          reverseOrder={false}
        />
        <StoreProvider>
          <GoogleSync />
          <Navbar />
          <LoginModal />
          <RegisterModal />
          <NextTopLoader color="#3b82f6" height={4} showSpinner={false} />
          <ScrollToTopButton />
          <BottomNavbar />
          {children}
        </StoreProvider>
      </body>
    </html>
  )
}
