"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Heading from "../Misc/Heading"
import BreadCrumb from "../Misc/BreadCrumb"
import Image from "next/image"
import Button from "../Misc/Button"
import { Grid3x3, X, ChevronLeft, ChevronRight, CropIcon, Share, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface ListingHeadProps {
  id: number
  imageSrc: string[]
  title: string
  roomCount: number
  category: string
}

const ListingHead: React.FC<ListingHeadProps> = ({ imageSrc, title }) => {
  const router = useRouter();
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

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = window.location.href;

    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: title,
          text: `Check out this houseboat: ${title}`,
          url: shareUrl
        });
      } else {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareUrl)}`;
        window.open(whatsappUrl, '_blank');
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const gridImages = imageSrc.slice(1, 5)

  return (
    <>
      <div className="pt-14 w-11/12 mx-auto">
        <div className="hidden md:flex items-start justify-between">
          <div className="flex  flex-col flex-1 gap-2">
            <BreadCrumb />
            <Heading title={title} />
          </div>
        </div>

        <div className="relative mt-2 md:mt-0">
          <div className="grid grid-cols-4 gap-2 rounded-xl mb-2 overflow-hidden h-[350] md:h-[500]">
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.back();
                  }}
                  className="absolute left-4 top-8 bg-white/90 p-2 rounded-full shadow-md z-20 hover:bg-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={handleShare}
                  className="absolute right-4 top-8 bg-white/90 p-2 rounded-full shadow-md z-20 hover:bg-white transition-colors"
                >
                  <Share className="w-5 h-5 text-gray-700" />
                </button>
              </div>

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
              className={`relative shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer transition-all ${mobileMainImageIndex === index ? "ring-2 ring-blue-400" : ""
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

        {showAllPhotos && (
          <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
            <div className="min-h-screen p-8">
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8 sticky top-0 bg-black py-4">
                  <h2 className="text-white text-xl font-semibold">All Photos</h2>
                  <div className="w-1/4"><Button label="Close" onClick={() => setShowAllPhotos(false)} /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {imageSrc.map((img, index) => (
                    <div key={index} className="relative aspect-4/3 rounded-lg overflow-hidden">
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
      </div>
    </>
  )
}

export default ListingHead