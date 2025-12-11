'use client';

import React from 'react';
import Link from 'next/link';
import GetHeroListings, { HeroListing } from '@/app/actions/getHeroListings';
import useSWR from 'swr';


interface GridSectionProps {
  title: string;
  path: string;
  items: HeroListing[];
}


const ListingHero: React.FC = () => {

  const { data: listings = [], error, isLoading } = useSWR('hero-listings', GetHeroListings, {
    revalidateOnFocus: false,
    dedupingInterval: 600000, // Cache for 5 minutes
    errorRetryCount: 3, // Retry failed requests
    refreshInterval: 0, // Don't auto-refresh (or set to 60000 for 1-minute refresh)
  });


  const GridSection: React.FC<GridSectionProps> = ({ title, items, path }) => (
    <div className="mb-5">
      {/* Section Title */}
      <div className="px-4 sm:px-6 lg:px-8 mb-6">
        <div
          className="inline-flex items-center text-xl sm:text-2xl text-black font-medium transition-colors duration-300 group"
        >
          <h2 className="mr-3">{title}</h2>
        </div>
      </div>

      {/* Scrollable Grid - Hidden scrollbar on mobile */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="overflow-x-auto overflow-y-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div className="flex space-x-4 pb-4 min-w-max">
            {items.map((item) => (
              <Link
                key={item.id}
                href="/houseBoats"
                className="flex-shrink-0 w-48 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group block"
              >
                {/* Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                {/* Content */}
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm font-semibold text-gray-900">
                    ₹{item.dayCruisePrice.toLocaleString('en-IN')}
                    <span className="text-sm font-normal text-gray-600 ml-1">
                      per day
                    </span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Skeleton Loading Component
  const SkeletonCard = () => (
    <div className="flex-shrink-0 w-48 bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
      {/* Image Skeleton */}
      <div className="h-40 bg-gray-200"></div>

      {/* Content Skeleton */}
      <div className="p-4">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  );

  const SkeletonSection = ({ title }: { title: string }) => (
    <div className="mb-12">
      {/* Section Title */}
      <div className="px-4 sm:px-6 lg:px-8 mb-6">
        <div className="inline-flex items-center">
          <h2 className="mr-3 text-xl sm:text-2xl text-black font-medium">{title}</h2>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>

      {/* Scrollable Grid Skeleton */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="overflow-x-auto overflow-y-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div className="flex space-x-4 pb-4 min-w-max">
            {[...Array(5)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <section className="bg-gray-50 min-h-screen">
        <div className="pt-56 md:pt-40 pb-12">
          {/* Skeleton Sections */}
          <SkeletonSection title="Houseboats" />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 h-auto">
      <div className="pt-40 md:pt-24 ">

        {/* Houseboats Section */}
        <GridSection title="Today Hot Deals Individual" items={listings} path="houseBoats" />
        <GridSection title="Today Hot Deals Sharing" items={listings} path="houseBoats" />

        {/* Shikara Section */}
        {/* <GridSection title="Shikara" items={shikaras} path="shikara" /> */}

        {/* Kayaks Section */}
        {/* <GridSection title="Kayaks" items={kayaks} path="kayaks" /> */}

      </div>
    </section>
  );
};

export default ListingHero;