import LoginModal from './components/Modals/LoginModal'
import RegisterModal from './components/Modals/RegisterModal'
import Navbar from './components/Navbar/Navbar'
import './globals.css'
import { Inter } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader';
import ScrollToTopButton from './components/Misc/ScrolltoTop'
import { Toaster } from 'react-hot-toast'
import Script from 'next/script'
import BottomNavbar from './components/BottomNavbar/BottomNavbar'
import GoogleSync from './components/Auth/GoogleSync'

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true
})


export const metadata = {
  title: 'Housefloating.com - Book Houseboats in Alleppey',
  description: "Housefloating.com is the #1 portal to book luxury Alleppey houseboats at best prices. Experience premium Kerala houseboats and unforgettable journeys online.",
  manifest: "/manifest.json",
  icons: {
    icon: "/images/hf-Logo.jpg",
    shortcut: "/images/hf-Logo.jpg",
    apple: "/images/hf-Logo.jpg",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/images/hf-Logo.jpg",
    },
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
        {/* ✅ Google Tag Manager (GTM) - Head Script */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-PDC8KBVM');
            `,
          }}
        />
      </head>

      <body className={inter.className}>
        {/* ✅ Google Tag Manager (GTM) - NoScript (For users with JS disabled) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PDC8KBVM"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

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
