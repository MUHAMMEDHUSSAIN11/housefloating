'use client';

import React, { useState } from 'react';
import { categories } from './SortCategories'; // Ensure the correct path
import UserMenuItem from '../Navbar/UserMenuItem'; // Ensure the correct path

interface FilterProps {
  setSortedListings: (category: string, roomCount: number) => void;
}

const Filter: React.FC<FilterProps> = ({ setSortedListings }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedRoomCount, setSelectedRoomCount] = useState<number>(2);
  const [isRoomFilterOpen, setIsRoomFilterOpen] = useState<boolean>(false);
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState<boolean>(false);

  // Category change handler
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSortedListings(category, selectedRoomCount);
  };

  // Room count change handler
  const handleRoomCountChange = (newCount: number) => {
    console.log("roomcount", newCount);
    setSelectedRoomCount(newCount);
    setSortedListings(selectedCategory, newCount);
  };

  return (
    <div className="flex flex-row items-center justify-center mt-9 font-sans bg-white w-auto sm:py-2 py-2 rounded-full shadow-md transition cursor-pointer gap-4">
      <div className="text-md px-6 flex-1 text-center relative mr-4">
        <button
          className="py-2 px-4 font-semibold bg-secondary text-black rounded-[5px] w-full flex items-center justify-between"
          onClick={() => setIsCategoryFilterOpen(!isCategoryFilterOpen)}
        >
          <span className="font-semibold">
            {selectedCategory || "Category"}
          </span>
          <span className="pl-4">
            <svg
              width={20}
              height={20}
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`fill-current transform transition-transform duration-200 ${isCategoryFilterOpen ? 'rotate-180' : ''}`}
            >
              <path d="M10 14.25C9.8125 14.25 9.65625 14.1875 9.5 14.0625L2.3125 7C2.03125 6.71875 2.03125 6.28125 2.3125 6C2.59375 5.71875 3.03125 5.71875 3.3125 6L10 12.5312L16.6875 5.9375C16.9688 5.65625 17.4063 5.65625 17.6875 5.9375C17.9687 6.21875 17.9687 6.65625 17.6875 6.9375L10.5 14C10.3437 14.1563 10.1875 14.25 10 14.25Z" />
            </svg>
          </span>
        </button>
        {isCategoryFilterOpen && (
          <div className="absolute z-40 mt-4 w-full rounded-md bg-white shadow-lg dark:bg-dark-2 py-2">
            {categories.map((item) => (
              <UserMenuItem
                key={item.label}
                onClick={() => handleCategoryChange(item.label)}
                label={item.label}
              />
            ))}
          </div>
        )}
      </div>

      <div className="text-md px-6 text-center relative">
        {/* Room Count Dropdown */}
        <button
          onClick={() => setIsRoomFilterOpen(!isRoomFilterOpen)}
          className="py-2 px-4 font-semibold bg-secondary text-black rounded-[5px] w-full flex items-center justify-between"
        >
          <span className="font-semibold">
            {selectedRoomCount} Room{selectedRoomCount > 1 ? 's' : ''}
          </span>
          <span className="pl-4">
            <svg
              width={20}
              height={20}
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`fill-current transform transition-transform duration-200 ${isRoomFilterOpen ? 'rotate-180' : ''}`}
            >
              <path d="M10 14.25C9.8125 14.25 9.65625 14.1875 9.5 14.0625L2.3125 7C2.03125 6.71875 2.03125 6.28125 2.3125 6C2.59375 5.71875 3.03125 5.71875 3.3125 6L10 12.5312L16.6875 5.9375C16.9688 5.65625 17.4063 5.65625 17.6875 5.9375C17.9687 6.21875 17.9687 6.65625 17.6875 6.9375L10.5 14C10.3437 14.1563 10.1875 14.25 10 14.25Z" />
            </svg>
          </span>
        </button>

        {/* Room count options dropdown */}
        {isRoomFilterOpen && (
          <div className="absolute left-0 z-40 mt-4 w-full rounded-md bg-white shadow-lg dark:bg-dark-2 py-2">
            {[1, 2, 3, 4, 5].map((roomCount) => (
              <UserMenuItem
                key={roomCount}
                onClick={() => handleRoomCountChange(roomCount)}
                label={`${roomCount} Room${roomCount > 1 ? 's' : ''}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Filter;
