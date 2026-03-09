"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export default function GTMTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if(pathname) {
        const url = pathname + searchParams?.toString()

        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({
        event: "pageview",
        page: url,
        })
    }
  }, [pathname, searchParams])

  return null
}