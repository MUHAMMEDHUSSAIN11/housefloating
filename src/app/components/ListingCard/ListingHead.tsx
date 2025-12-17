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
     <>
      <div className="pt-28 md:pt-14 w-11/12 mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div className="flex  flex-col flex-1 gap-2">
            <BreadCrumb />
            <Heading title={title} />
          </div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-4 gap-2 rounded-xl overflow-hidden h-[350px] md:h-[500px]">
            <div
              className="col-span-4 md:col-span-2 row-span-1 relative group cursor-pointer overflow-hidden"
              onClick={() => setCurrentImageIndex(mobileMainImageIndex)}
            >
              <Image
                src={imageSrc[mobileMainImageIndex] || "/placeholder.svg"}
                alt={title}
                fill
                className="object-cover md:group-hover:scale-105 transition-transform duration-300"
              />

              <div className="md:hidden">
                {mobileMainImageIndex > 0 && (
                  <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full shadow-lg z-10"
                    onClick={(e) => {
                      e.stopPropagation()
                      goToPreviousMobile()
                    }}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                )}

                {mobileMainImageIndex < imageSrc.length - 1 && (
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full shadow-lg z-10"
                    onClick={(e) => {
                      e.stopPropagation()
                      goToNextMobile()
                    }}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                )}

                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                  {mobileMainImageIndex + 1} / {imageSrc.length}
                </div>
              </div>
            </div>

            <div className="hidden md:grid md:col-span-2 grid-cols-2 grid-rows-2 gap-2">
              {gridImages.map((img, index) => (
                <div
                  key={index}
                  className="relative group cursor-pointer overflow-hidden"
                  onClick={() => setCurrentImageIndex(index + 1)}
                >
                  <Image
                    src={img || "/placeholder.svg"}
                    alt={`${title} view ${index + 2}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="25vw"
                  />
                  {index === gridImages.length - 1 && imageSrc.length > 5 && (
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {imageSrc.length > 5 && (
            <Button icon={Grid3x3} label="show all Photos" onClick={() => setShowAllPhotos(true)} />
          )}
        </div>

        <div className="flex md:hidden gap-2 mt-4 overflow-x-auto pb-2 p-2 scrollbar-hide">
          {imageSrc.map((img, index) => (
            <div
              key={index}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer transition-all ${
                mobileMainImageIndex === index ? "ring-2 ring-blue-400" : ""
              }`}
              onClick={() => handleThumbnailClick(index)}
            >
              <Image
                src={img || "/placeholder.svg"}
                alt={`${title} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
        </div>
    </>
  )
}

export default ListingHead