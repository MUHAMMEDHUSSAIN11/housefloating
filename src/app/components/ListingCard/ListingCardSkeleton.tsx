'use client';

const ListingCardSkeleton = () => {
  return (
    <div className="col-span-1">
      <div className="flex flex-col w-full">
        <div className="aspect-[4/3] w-full relative overflow-hidden rounded-lg bg-gray-200">
          <div className="w-full h-full bg-gray-300"></div>
        </div>
        
        <div className="mt-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-2/4"></div>
        </div>
        
        {/* Price skeleton */}
        <div className="flex flex-row items-center gap-1 mt-1">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
        </div>
        
        {/* Offer price skeleton */}
        <div className="flex flex-row items-center gap-1 mt-1">
          <div className="h-5 bg-gray-200 rounded animate-pulse w-20"></div>
        </div>
      </div>
    </div>
  )
}

export default ListingCardSkeleton