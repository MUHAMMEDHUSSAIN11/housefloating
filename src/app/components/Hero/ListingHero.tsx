'use client';

import React from 'react';
import Link from 'next/link';
import GetRandomBoats from '@/app/actions/GetRandomBoats/GetRandomBoats';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import useSearchStore from '@/app/hooks/useSearchStore';
import FormatToLocalDate from '../Misc/FormatToLocalDate';
import { amount, BoatCruisesId } from '@/app/enums/enums';


interface HeroListing {
  boatId: number;
  basePrice: number;
  boatName: string;
  boatCategory: string;
  roomCount: number;
  thumbnailImage: string;
}

interface GridSectionProps {
  title: string;
  items: HeroListing[];
}


const ListingHero: React.FC = () => {

  const { data: listings = [], error, isLoading } = useSWR('hero-listings', GetRandomBoats, {
    revalidateOnFocus: false,
    dedupingInterval: 600000,
    errorRetryCount: 3,
    refreshInterval: 0,
  });

  const router = useRouter();
  const {
    validateFields,
    selectedType,
    selectedCategory,
    roomCount,
    selectedDateRange,
    selectedCruise,
    setIsMobileModalOpen,
    setActiveSection,
  } = useSearchStore();

  const handleBoatClick = () => {
    if (validateFields()) {
      const params = new URLSearchParams();
      if (selectedType) params.append('type', selectedType.toString());
      if (selectedCategory) params.append('category', selectedCategory.toString());
      params.append('rooms', roomCount.toString());

      if (selectedDateRange.startDate) {
        params.append('startDate', FormatToLocalDate(selectedDateRange.startDate));
        let calculatedEndDate: Date | null = selectedDateRange.endDate;

        if (selectedCruise === BoatCruisesId.dayCruise) {
          calculatedEndDate = selectedDateRange.startDate;
        } else if (selectedCruise === BoatCruisesId.nightStay) {
          calculatedEndDate = new Date(selectedDateRange.startDate);
          calculatedEndDate.setDate(calculatedEndDate.getDate() + 1);
        }

        if (calculatedEndDate) {
          params.append('endDate', FormatToLocalDate(calculatedEndDate));
        }
      }
      params.append('cruise', selectedCruise.toString());
      router.push(`/houseBoats?${params.toString()}`);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // If mobile, open the search modal automatically
      if (window.innerWidth < 768) {
        setIsMobileModalOpen(true);
      } else if (window.innerWidth >= 768 && !selectedDateRange.startDate) {
        setActiveSection('date');
      } else if (!selectedType) {
        // If desktop, open the type section automatically if it's missing
        setActiveSection('type');
      }
    }
  };

  const GridSection: React.FC<GridSectionProps> = ({ title, items }) => (
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
              <div
                key={item.boatId}
                onClick={handleBoatClick}
                className="shrink-0 w-48 bg-white rounded-xl overflow-y-auto shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group block"
              >
                {/* Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={item.thumbnailImage}
                    alt={item.boatName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                {/* Content */}
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {item.boatCategory} • {item.roomCount} Bedroom
                  </h3>
                  <p className="text-sm font-semibold text-gray-900">
                    ₹{Math.round(item.basePrice * amount.commissionPercentage)}
                    <span className="text-sm font-normal text-gray-600 ml-1">
                      For DayNight
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Skeleton Loading Component
  const SkeletonCard = () => (
    <div className="shrink-0 w-48 bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
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
          <SkeletonSection title="Favourite Picks" />
        </div>
      </section>
    );
  }

  // If no listings, maybe return null or empty?
  if (listings.length === 0) {
    return null;
  }

  return (
    <section className="bg-gray-50 h-auto">
      <div className="pt-48 lg:pt-36 ">
        {/* Favourite Picks Section */}
        <GridSection title="Favourite Picks" items={listings} />
      </div>
    </section>
  );
};

export default ListingHero;