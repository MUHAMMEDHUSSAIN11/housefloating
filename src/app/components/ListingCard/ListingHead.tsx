"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Heading from "../Misc/Heading"
import BreadCrumb from "../Misc/BreadCrumb"
import Image from "next/image"
import Button from "../Misc/Button"
import {Grid3x3, X, ChevronLeft, ChevronRight } from "lucide-react"

interface ListingHeadProps {
  id: string
  imageSrc: string[]
  title: string
  roomCount: number
  category: string
}

const ListingHead: React.FC<ListingHeadProps> = ({ imageSrc, title }) => {
  const [showAllPhotos, setShowAllPhotos] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null)
  const [mobileMainImageIndex, setMobileMainImageIndex] = useState(0)

  useEffect(() => {
    if (currentImageIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious()
      } else if (e.key === "ArrowRight") {
        goToNext()
      } else if (e.key === "Escape") {
        setCurrentImageIndex(null)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentImageIndex])

  const goToPrevious = () => {
    if (currentImageIndex !== null && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    }
  }

  const goToNext = () => {
    if (currentImageIndex !== null && currentImageIndex < imageSrc.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
  }

  const goToPreviousMobile = () => {
    if (mobileMainImageIndex > 0) {
      setMobileMainImageIndex(mobileMainImageIndex - 1)
    }
  }

  const goToNextMobile = () => {
    if (mobileMainImageIndex < imageSrc.length - 1) {
      setMobileMainImageIndex(mobileMainImageIndex + 1)
    }
  }

  const handleThumbnailClick = (index: number) => {
    setMobileMainImageIndex(index)
  }

  const gridImages = imageSrc.slice(1, 5)

  return (
    <div className='p-1 pt-28 md:pt-14'>
      <Heading title={title} subtitle={`${category} `} />
      <BreadCrumb/>
      <div className="aspect-square w-full h-[50vh] overflow-hidden rounded-xl relative group">
        <Image className="object-contain h-full w-full transition" src={imageSrc[currentIndex]} width={650} height={650} alt={title} />
      </div>

      {showAllPhotos && (
        <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
          <div className="min-h-screen p-8">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-8 sticky top-0 bg-black py-4">
                <h2 className="text-white text-xl font-semibold">All Photos</h2>
                <Button label="Close" onClick={() => setShowAllPhotos(false)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {imageSrc.map((img, index) => (
                  <div key={index} className="relative aspect-[4/3] rounded-lg overflow-hidden">
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={`${title} photo ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {currentImageIndex !== null && (
        <div
          className="fixed inset-10 inset-y-40 lg:inset-40 bg-black z-50 flex items-center justify-center p-4"
          onClick={() => setCurrentImageIndex(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:bg-white/10 p-2 rounded-full z-10"
            onClick={(e) => {
              e.stopPropagation()
              setCurrentImageIndex(null)
            }}
          >
            <X className="h-6 w-6" />
          </button>

          {currentImageIndex > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 p-2 rounded-full z-10"
              onClick={(e) => {
                e.stopPropagation()
                goToPrevious()
              }}
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          )}

          {currentImageIndex < imageSrc.length - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 p-2 rounded-full z-10"
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full z-10">
            {currentImageIndex + 1} / {imageSrc.length}
          </div>

          <div className="relative w-full h-full max-w-7xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={imageSrc[currentImageIndex] || "/placeholder.svg"}
              alt="Full screen view"
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      )}
    </>
  )
}

export default ListingHead