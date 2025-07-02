'use client';

import React, { useState } from 'react';
import { categories } from './SortCategories';
import UserMenuItem from '../Navbar/UserMenuItem';
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import useClickOutside from '@/app/hooks/useClickOutside';

interface FilterProps {
  setFilteredListings: (category: string, roomCount: number) => void;
}

const Filter: React.FC<FilterProps> = ({ setFilteredListings }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedRoomCount, setSelectedRoomCount] = useState<number>(0); // Changed to 0 for "All"
  
  // Use separate hooks for each dropdown
  const categoryDropdown = useClickOutside(false);
  const roomDropdown = useClickOutside(false);

  // Category change handler
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setFilteredListings(category, selectedRoomCount);
    categoryDropdown.setIsOpen(false); // Close dropdown after selection
  };

  // Room count change handler
  const handleRoomCountChange = (newCount: number) => {
    console.log("roomcount", newCount);
    setSelectedRoomCount(newCount);
    setFilteredListings(selectedCategory, newCount);
    roomDropdown.setIsOpen(false); // Close dropdown after selection
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedRoomCount(0);
    setFilteredListings('', 0);
  };

  const handleCategoryClick = () => {
    // Close room dropdown if open
    if (roomDropdown.isOpen) {
      roomDropdown.setIsOpen(false);
    }
    categoryDropdown.setIsOpen(!categoryDropdown.isOpen);
  };

  const handleRoomClick = () => {
    // Close category dropdown if open
    if (categoryDropdown.isOpen) {
      categoryDropdown.setIsOpen(false);
    }
    roomDropdown.setIsOpen(!roomDropdown.isOpen);
  };

  return (
    <div className="flex flex-row items-center justify-center mt-9 font-sans bg-white w-auto py-2 rounded-full shadow-lg transition cursor-pointer gap-4">
      <div className="p-2 ml-3 bg-blue-500 rounded-full text-white flex items-center justify-center">
        <HiAdjustmentsHorizontal size={24} />
      </div>
      
      {/* Category Filter */}
      <div className="text-md flex-1 text-center relative mr-4">
        <button
          className="py-2 px-4 font-semibold bg-secondary text-black rounded-[5px] w-full flex items-center justify-between"
          onClick={handleCategoryClick}
        >
          <span className="font-semibold">
            {selectedCategory || "All Categories"}
          </span>
          <span className="pl-4">
            <svg
              width={20}
              height={20}
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`fill-current transform transition-transform duration-200 ${categoryDropdown.isOpen ? 'rotate-180' : ''}`}
            >
              <path d="M10 14.25C9.8125 14.25 9.65625 14.1875 9.5 14.0625L2.3125 7C2.03125 6.71875 2.03125 6.28125 2.3125 6C2.59375 5.71875 3.03125 5.71875 3.3125 6L10 12.5312L16.6875 5.9375C16.9688 5.65625 17.4063 5.65625 17.6875 5.9375C17.9687 6.21875 17.9687 6.65625 17.6875 6.9375L10.5 14C10.3437 14.1563 10.1875 14.25 10 14.25Z" />
            </svg>
          </span>
        </button>
        
        {categoryDropdown.isOpen && (
          <div 
            ref={categoryDropdown.ref}
            className="absolute z-40 mt-4 w-full rounded-md bg-white shadow-lg dark:bg-dark-2 py-2"
          >
            {/* Add "All Categories" option */}
            <UserMenuItem
              onClick={() => handleCategoryChange('')}
              label="All Categories"
            />
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

      {/* Room Count Filter */}
      <div className="text-md text-center relative">
        <button
          onClick={handleRoomClick}
          className="py-2 px-4 font-semibold bg-secondary text-black rounded-[5px] w-full flex items-center justify-between"
        >
          <span className="font-semibold">
            {selectedRoomCount === 0 ? 'All Rooms' : `${selectedRoomCount} Room${selectedRoomCount > 1 ? 's' : ''}`}
          </span>
          <span className="pl-4">
            <svg
              width={20}
              height={20}
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`fill-current transform transition-transform duration-200 ${roomDropdown.isOpen ? 'rotate-180' : ''}`}
            >
              <path d="M10 14.25C9.8125 14.25 9.65625 14.1875 9.5 14.0625L2.3125 7C2.03125 6.71875 2.03125 6.28125 2.3125 6C2.59375 5.71875 3.03125 5.71875 3.3125 6L10 12.5312L16.6875 5.9375C16.9688 5.65625 17.4063 5.65625 17.6875 5.9375C17.9687 6.21875 17.9687 6.65625 17.6875 6.9375L10.5 14C10.3437 14.1563 10.1875 14.25 10 14.25Z" />
            </svg>
          </span>
        </button>

        {roomDropdown.isOpen && (
          <div 
            ref={roomDropdown.ref}
            className="absolute left-0 z-40 mt-4 mr-2 w-full rounded-md bg-white shadow-lg dark:bg-dark-2 py-2"
          >
            {/* Add "All Rooms" option */}
            <UserMenuItem
              onClick={() => handleRoomCountChange(0)}
              label="All Rooms"
            />
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

      {/* Clear Filters Button (optional) */}
      {(selectedCategory !== '' || selectedRoomCount !== 0) && (
        <button
          onClick={clearFilters}
          className="py-2 px-4 mr-3 font-semibold bg-gray-200 hover:bg-gray-300 text-black rounded-[5px] text-sm transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  );
};

export default Filter;