import React from 'react';

const ListingSkeleton = () => (
  <div className="flex flex-col gap-6">
    {/* Image skeleton */}
    <div className="w-full h-64 bg-gray-300 rounded-lg animate-pulse" />
    {/* Title skeleton */}
    <div className="h-8 w-1/2 bg-gray-300 rounded animate-pulse mt-4" />
    {/* Category and room count skeleton */}
    <div className="flex gap-4 mt-2">
      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
    </div>
  </div>
);

export default ListingSkeleton;