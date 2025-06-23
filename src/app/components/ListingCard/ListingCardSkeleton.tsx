'use client';

const ListingCardSkeleton = () => {
  return (
    <div className="col-span-1">
      <div className="flex flex-col gap-2 w-full">
        {/* Image skeleton */}
        <div className="aspect-square w-full relative overflow-hidden rounded-xl bg-gray-200 animate-pulse">
          <div className="w-full h-full bg-gray-300"></div>
        </div>
        
        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
        </div>
        
        {/* Category skeleton */}
        <div className="flex flex-row items-center gap-1">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
        </div>
        
        {/* Price skeleton */}
        <div className="flex flex-row items-center gap-1">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
        </div>
        
        {/* Offer price skeleton */}
        <div className="flex flex-row items-center gap-1">
          <div className="h-5 bg-gray-200 rounded animate-pulse w-20"></div>
        </div>
        
        {/* Optional button skeleton */}
        <div className="h-10 bg-gray-200 rounded animate-pulse w-full mt-2"></div>
      </div>
    </div>
  )
}

export default ListingCardSkeleton