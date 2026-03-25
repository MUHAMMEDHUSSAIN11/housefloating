'use client';

import React from 'react';
import GetRandomBoats from '@/app/actions/GetRandomBoats/GetRandomBoats';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import useSearchStore from '@/app/hooks/useSearchStore';
import FormatToLocalDate from '../Misc/FormatToLocalDate';
import { amount, BoatCruisesId } from '@/app/enums/enums';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import FormatIndianCurrency from '../Misc/FormatIndianCurrency';


interface HeroListing {
  boatId: number;
  basePrice: number;
  bookingPrice: number;
  boatName: string;
  boatCategory: string;
  roomCount: number;
  thumbnailImage: string;
}

interface GridSectionProps {
  title: string;
  items: HeroListing[];
  onBoatClick: () => void;
}

const altTexts = [
  "Luxury houseboat Alleppey cruising through the serene Kerala backwaters on Vembanad Lake",
  "Best houseboat in Alleppey with a spacious deck and traditional design",
  "Premium luxury houseboat Alleppey interior showing cosy air-conditioned bedroom",
  "Alappuzha houseboat offering scenic backwaters view from the upper sundeck",
  "Private luxury houseboat in Alleppey with elegant wooden interiors and comfortable seating",
  "Traditional Kerala houseboat Alleppey gliding past lush green palm-fringed canals",
  "Best houseboat in Alleppey featuring a dining area with delicious Kerala cuisine onboard",
  "Luxury houseboat Alleppey at sunset with beautiful backwaters reflection in Alappuzha",
  "Spacious family houseboat in Alleppey with multiple bedrooms and a private deck",
  "Alappuzha boat house booking experience showing happy guests enjoying a Kerala backwaters cruise"
];

const GridSection: React.FC<GridSectionProps> = ({ title, items, onBoatClick }) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="mb-5 relative group/section">
      {/* Section Title */}
      <div className="px-4 sm:px-6 lg:px-8 mb-6">
        <div
          className="inline-flex items-center text-xl sm:text-2xl text-black font-medium transition-colors duration-300 group"
        >
          <h1 className="mr-3">{title}</h1>
        </div>
      </div>

      {/* Scrollable Grid Wrapper */}
      <div className="px-4 sm:px-6 lg:px-8 relative group/grid">
        {/* Navigation Buttons - Simple side buttons */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-1 top-[45%] -translate-y-1/2 z-10 p-1 rounded-full border border-gray-100 bg-white/90 text-gray-600 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 cursor-pointer hidden md:flex items-center justify-center shadow-sm opacity-0 group-hover/grid:opacity-100"
          aria-label="Scroll Left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => scroll('right')}
          className="absolute right-1 top-[45%] -translate-y-1/2 z-10 p-1 rounded-full border border-gray-100 bg-white/90 text-gray-600 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 cursor-pointer hidden md:flex items-center justify-center shadow-sm opacity-0 group-hover/grid:opacity-100"
          aria-label="Scroll Right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto overflow-y-hidden scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div className="flex space-x-4 pb-4 min-w-max">
            {items.map((item, index) => (
              <div
                key={item.boatId}
                onClick={onBoatClick}
                className="shrink-0 w-48 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group block"
              >
                {/* Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={item.thumbnailImage}
                    alt={altTexts[index]}
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
                  <div className="mt-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md w-fit">
                    Reserve Today – Advance ₹{FormatIndianCurrency(item.bookingPrice)}/-
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

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
    setTriggerSection,
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
        setTriggerSection('date');
      } else if (!selectedType) {
        setTriggerSection('type');
      }
    }
  };

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
          <h1 className="mr-3 text-xl sm:text-2xl text-black font-medium">{title}</h1>
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
          <SkeletonSection title="Favourite Picks for Houseboat Alleppey" />
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
        <GridSection title="Favourite Picks for Houseboat Alleppey" items={listings} onBoatClick={handleBoatClick} />
      </div>
    </section>
  );
};

export default ListingHero;