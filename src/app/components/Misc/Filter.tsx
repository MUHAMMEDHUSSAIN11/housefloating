'use client';

import React, { useState } from 'react';
import { categories } from './SortCategories';
import UserMenuItem from '../Navbar/UserMenuItem';
import { HiAdjustmentsHorizontal, HiXMark } from "react-icons/hi2";
import useClickOutside from '@/app/hooks/useClickOutside';

interface FilterProps {
  setFilteredListings: (category: string, roomCount: number) => void;
}

// Create a mapping for display names
const getCategoryDisplayName = (category: string): string => {
  const displayMap: { [key: string]: string } = {
    'Deluxe Houseboats': 'Deluxe',
    'Premium Houseboats': 'Premium',
    'Luxury Houseboats': 'Luxury',
  };
  
  return displayMap[category] || category;
};

const Filter: React.FC<FilterProps> = ({ setFilteredListings }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedRoomCount, setSelectedRoomCount] = useState<number>(0);
  const [showMobileModal, setShowMobileModal] = useState<boolean>(false);

  // Use the updated hook that returns toggleRef
  const categoryDropdown = useClickOutside(false);
  const roomDropdown = useClickOutside(false);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setFilteredListings(category, selectedRoomCount);
    categoryDropdown.setIsOpen(false);
  };

  const handleRoomCountChange = (newCount: number) => {
    setSelectedRoomCount(newCount);
    setFilteredListings(selectedCategory, newCount);
    roomDropdown.setIsOpen(false);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedRoomCount(0);
    setFilteredListings('', 0);
    setShowMobileModal(false);
  };

  const applyFilters = () => {
    setShowMobileModal(false);
  };

  const handleCategoryClick = () => {
    if (roomDropdown.isOpen) {
      roomDropdown.setIsOpen(false);
    }
    categoryDropdown.setIsOpen(!categoryDropdown.isOpen);
  };

  const handleRoomClick = () => {
    if (categoryDropdown.isOpen) {
      categoryDropdown.setIsOpen(false);
    }
    roomDropdown.setIsOpen(!roomDropdown.isOpen);
  };

  // Get display name for selected category
  const getDisplayText = (category: string) => {
    if (!category) return "All Categories";
    return getCategoryDisplayName(category);
  };

  const hasActiveFilters = selectedCategory !== '' || selectedRoomCount !== 0;

  return (
    <>
      <div className="pt-9">
        {/* Mobile Filter - Same Design as Desktop */}
        <div className="lg:hidden flex justify-center">
          <div className="flex flex-row items-center justify-center font-sans bg-white w-auto py-2 rounded-full shadow-lg transition cursor-pointer gap-4 max-w-4xl mx-auto">
            <button
              onClick={() => setShowMobileModal(true)}
              className="p-2 ml-3 bg-blue-500 rounded-full text-white flex items-center justify-center relative"
            >
              <HiAdjustmentsHorizontal size={24} />
              {hasActiveFilters && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              )}
            </button>

            {/* Category Filter Display */}
            <div className="text-md flex-1 text-center relative mr-4 min-w-0">
              <button
                className="py-2 px-4 font-semibold bg-secondary text-black rounded-[5px] w-full flex items-center justify-between min-w-0"
                onClick={() => setShowMobileModal(true)}
              >
                <span className="font-semibold truncate">
                  {getDisplayText(selectedCategory)}
                </span>
                <span className="pl-4 flex-shrink-0">
                  <svg
                    width={20}
                    height={20}
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="fill-current"
                  >
                    <path d="M10 14.25C9.8125 14.25 9.65625 14.1875 9.5 14.0625L2.3125 7C2.03125 6.71875 2.03125 6.28125 2.3125 6C2.59375 5.71875 3.03125 5.71875 3.3125 6L10 12.5312L16.6875 5.9375C16.9688 5.65625 17.4063 5.65625 17.6875 5.9375C17.9687 6.21875 17.9687 6.65625 17.6875 6.9375L10.5 14C10.3437 14.1563 10.1875 14.25 10 14.25Z" />
                  </svg>
                </span>
              </button>
            </div>

            {/* Room Count Filter Display */}
            <div className="text-md text-center relative flex-shrink-0">
              <button
                onClick={() => setShowMobileModal(true)}
                className="py-2 px-4 font-semibold bg-secondary text-black rounded-[5px] w-full flex items-center justify-between whitespace-nowrap"
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
                    className="fill-current"
                  >
                    <path d="M10 14.25C9.8125 14.25 9.65625 14.1875 9.5 14.0625L2.3125 7C2.03125 6.71875 2.03125 6.28125 2.3125 6C2.59375 5.71875 3.03125 5.71875 3.3125 6L10 12.5312L16.6875 5.9375C16.9688 5.65625 17.4063 5.65625 17.6875 5.9375C17.9687 6.21875 17.9687 6.65625 17.6875 6.9375L10.5 14C10.3437 14.1563 10.1875 14.25 10 14.25Z" />
                  </svg>
                </span>
              </button>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="py-2 px-4 mr-3 font-semibold bg-gray-200 hover:bg-gray-300 text-black rounded-[5px] text-sm transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Desktop Filter - Original Styling */}
        <div className="hidden lg:flex flex-row items-center justify-center font-sans bg-white w-auto py-2 rounded-full shadow-lg transition cursor-pointer gap-4 max-w-4xl mx-auto">
          <div className="p-2 ml-3 bg-blue-500 rounded-full text-white flex items-center justify-center">
            <HiAdjustmentsHorizontal size={24} />
          </div>

          {/* Category Filter */}
          <div className="text-md flex-1 text-center relative mr-4 min-w-0">
            <button
              ref={categoryDropdown.toggleRef} // Add toggleRef to the category button
              className="py-2 px-4 font-semibold bg-secondary text-black rounded-[5px] w-full flex items-center justify-between min-w-0"
              onClick={handleCategoryClick}
            >
              <span className="font-semibold truncate">
                {getDisplayText(selectedCategory)}
              </span>
              <span className="pl-4 flex-shrink-0">
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
                className="absolute z-40 mt-4 w-64 rounded-md bg-white shadow-lg dark:bg-dark-2 py-2 max-h-60 overflow-y-auto"
              >
                <UserMenuItem
                  onClick={() => handleCategoryChange('')}
                  label="All Categories"
                />
                {categories.map((item) => (
                  <UserMenuItem
                    key={item.label}
                    onClick={() => handleCategoryChange(item.label)}
                    label={getCategoryDisplayName(item.label)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Room Count Filter */}
          <div className="text-md text-center relative flex-shrink-0">
            <button
              ref={roomDropdown.toggleRef} // Add toggleRef to the room button
              onClick={handleRoomClick}
              className="py-2 px-4 font-semibold bg-secondary text-black rounded-[5px] w-full flex items-center justify-between whitespace-nowrap"
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
                className="absolute right-0 z-40 mt-4 w-48 rounded-md bg-white shadow-lg dark:bg-dark-2 py-2"
              >
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

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="py-2 px-4 mr-3 font-semibold bg-gray-200 hover:bg-gray-300 text-black rounded-[5px] text-sm transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Mobile Modal */}
      {showMobileModal && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowMobileModal(false)}
          />

          {/* Modal Content */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 transform transition-transform">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-full text-white">
                  <HiAdjustmentsHorizontal size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Filters</h3>
              </div>
              <button
                onClick={() => setShowMobileModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <HiXMark size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Filter Options */}
            <div className="space-y-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
                <div className="relative">
                  <button
                    ref={categoryDropdown.toggleRef} // Add toggleRef to mobile category button
                    className="w-full py-3 px-4 font-semibold bg-secondary text-black rounded-[5px] flex items-center justify-between"
                    onClick={handleCategoryClick}
                  >
                    <span className="font-semibold truncate">
                      {getDisplayText(selectedCategory)}
                    </span>
                    <svg
                      width={20}
                      height={20}
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`fill-current transform transition-transform duration-200 flex-shrink-0 ${categoryDropdown.isOpen ? 'rotate-180' : ''}`}
                    >
                      <path d="M10 14.25C9.8125 14.25 9.65625 14.1875 9.5 14.0625L2.3125 7C2.03125 6.71875 2.03125 6.28125 2.3125 6C2.59375 5.71875 3.03125 5.71875 3.3125 6L10 12.5312L16.6875 5.9375C16.9688 5.65625 17.4063 5.65625 17.6875 5.9375C17.9687 6.21875 17.9687 6.65625 17.6875 6.9375L10.5 14C10.3437 14.1563 10.1875 14.25 10 14.25Z" />
                    </svg>
                  </button>

                  {categoryDropdown.isOpen && (
                    <div
                      ref={categoryDropdown.ref}
                      className="absolute z-50 mt-2 w-full rounded-md bg-white shadow-lg border border-gray-200 py-2 max-h-48 overflow-y-auto"
                    >
                      <UserMenuItem
                        onClick={() => handleCategoryChange('')}
                        label="All Categories"
                      />
                      {categories.map((item) => (
                        <UserMenuItem
                          key={item.label}
                          onClick={() => handleCategoryChange(item.label)}
                          label={getCategoryDisplayName(item.label)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Room Count Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Rooms</label>
                <div className="relative">
                  <button
                    ref={roomDropdown.toggleRef} // Add toggleRef to mobile room button
                    onClick={handleRoomClick}
                    className="w-full py-3 px-4 font-semibold bg-secondary text-black rounded-[5px] flex items-center justify-between"
                  >
                    <span className="font-semibold">
                      {selectedRoomCount === 0 ? 'All Rooms' : `${selectedRoomCount} Room${selectedRoomCount > 1 ? 's' : ''}`}
                    </span>
                    <svg
                      width={20}
                      height={20}
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`fill-current transform transition-transform duration-200 flex-shrink-0 ${roomDropdown.isOpen ? 'rotate-180' : ''}`}
                    >
                      <path d="M10 14.25C9.8125 14.25 9.65625 14.1875 9.5 14.0625L2.3125 7C2.03125 6.71875 2.03125 6.28125 2.3125 6C2.59375 5.71875 3.03125 5.71875 3.3125 6L10 12.5312L16.6875 5.9375C16.9688 5.65625 17.4063 5.65625 17.6875 5.9375C17.9687 6.21875 17.9687 6.65625 17.6875 6.9375L10.5 14C10.3437 14.1563 10.1875 14.25 10 14.25Z" />
                    </svg>
                  </button>

                  {roomDropdown.isOpen && (
                    <div
                      ref={roomDropdown.ref}
                      className="absolute z-50 mt-2 w-full rounded-md bg-white shadow-lg border border-gray-200 py-2"
                    >
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
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-8">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex-1 py-3 px-4 font-semibold bg-gray-200 hover:bg-gray-300 text-black rounded-[5px] transition-colors"
                >
                  Clear Filters
                </button>
              )}
              <button
                onClick={applyFilters}
                className="flex-1 py-3 px-4 font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-[5px] transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Filter;