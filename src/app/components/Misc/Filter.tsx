'use client';

import React, { useState } from 'react';
import { categories } from './SortCategories';
import UserMenuItem from '../Navbar/UserMenuItem';
import { HiAdjustmentsHorizontal, HiXMark } from "react-icons/hi2";
import useClickOutside from '@/app/hooks/useClickOutside';

// Types
interface FilterState {
  category: string;
  roomCount: number;
}

interface FilterProps {
  setFilteredListings: (category: string, roomCount: number) => void;
}

// Constants
const CATEGORY_DISPLAY_MAP: Record<string, string> = {
  'Deluxe Houseboats': 'Deluxe',
  'Premium Houseboats': 'Premium',
  'Luxury Houseboats': 'Luxury',
};

const ROOM_OPTIONS = [1, 2, 3, 4, 5];

// Utility functions
const getCategoryDisplayName = (category: string): string => {
  return CATEGORY_DISPLAY_MAP[category] || category;
};

const getDisplayText = (category: string): string => {
  return category ? getCategoryDisplayName(category) : "All Categories";
};

const getRoomDisplayText = (roomCount: number): string => {
  if (roomCount === 0) return 'All Rooms';
  return `${roomCount} Room${roomCount > 1 ? 's' : ''}`;
};

const getMobileRoomDisplayText = (roomCount: number): string => {
  if (roomCount === 0) return 'All';
  return `${roomCount} Room${roomCount > 1 ? 's' : ''}`;
};

// Custom hooks
const useFilterState = (onFilterChange: (category: string, roomCount: number) => void) => {
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    roomCount: 0,
  });

  const updateCategory = (category: string) => {
    const newFilters = { ...filters, category };
    setFilters(newFilters);
    onFilterChange(newFilters.category, newFilters.roomCount);
  };

  const updateRoomCount = (roomCount: number) => {
    const newFilters = { ...filters, roomCount };
    setFilters(newFilters);
    onFilterChange(newFilters.category, newFilters.roomCount);
  };

  const clearFilters = () => {
    const newFilters = { category: '', roomCount: 0 };
    setFilters(newFilters);
    onFilterChange(newFilters.category, newFilters.roomCount);
  };

  const hasActiveFilters = filters.category !== '' || filters.roomCount !== 0;

  return {
    filters,
    updateCategory,
    updateRoomCount,
    clearFilters,
    hasActiveFilters,
  };
};

// Components
const DropdownIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`fill-current transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
  >
    <path d="M10 14.25C9.8125 14.25 9.65625 14.1875 9.5 14.0625L2.3125 7C2.03125 6.71875 2.03125 6.28125 2.3125 6C2.59375 5.71875 3.03125 5.71875 3.3125 6L10 12.5312L16.6875 5.9375C16.9688 5.65625 17.4063 5.65625 17.6875 5.9375C17.9687 6.21875 17.9687 6.65625 17.6875 6.9375L10.5 14C10.3437 14.1563 10.1875 14.25 10 14.25Z" />
  </svg>
);

const CategoryDropdown: React.FC<{
  isOpen: boolean;
  onCategoryChange: (category: string) => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
  isMobile?: boolean;
}> = ({ isOpen, onCategoryChange, dropdownRef, isMobile = false }) => {
  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={`absolute z-50 mt-2 w-full rounded-md bg-white shadow-lg border border-gray-200 py-2 ${
        isMobile ? 'max-h-40 overflow-y-auto' : 'max-h-48 overflow-y-auto'
      }`}
    >
      <UserMenuItem
        onClick={() => onCategoryChange('')}
        label="All Categories"
      />
      {categories.map((item) => (
        <UserMenuItem
          key={item.label}
          onClick={() => onCategoryChange(item.label)}
          label={getCategoryDisplayName(item.label)}
        />
      ))}
    </div>
  );
};

const RoomDropdown: React.FC<{
  isOpen: boolean;
  onRoomChange: (roomCount: number) => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
  isMobile?: boolean;
}> = ({ isOpen, onRoomChange, dropdownRef, isMobile = false }) => {
  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={`absolute z-50 mt-2 w-full rounded-md bg-white shadow-lg border border-gray-200 py-2 ${
        isMobile ? 'max-h-40 overflow-y-auto' : ''
      }`}
    >
      <UserMenuItem
        onClick={() => onRoomChange(0)}
        label="All Rooms"
      />
      {ROOM_OPTIONS.map((roomCount) => (
        <UserMenuItem
          key={roomCount}
          onClick={() => onRoomChange(roomCount)}
          label={getRoomDisplayText(roomCount)}
        />
      ))}
    </div>
  );
};

const MobileFilterModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  categoryDropdown: any;
  roomDropdown: any;
  onCategoryChange: (category: string) => void;
  onRoomChange: (roomCount: number) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}> = ({
  isOpen,
  onClose,
  filters,
  categoryDropdown,
  roomDropdown,
  onCategoryChange,
  onRoomChange,
  onClearFilters,
  hasActiveFilters,
}) => {
  if (!isOpen) return null;

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

  const handleClearFilters = () => {
    onClearFilters();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 transform transition-transform max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500 rounded-full text-white">
              <HiAdjustmentsHorizontal size={20} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Filters</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <HiXMark size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Filter Options */}
        <div className="space-y-6 min-h-0 flex-1">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
            <div className="relative">
              <button
                ref={categoryDropdown.toggleRef}
                className="w-full py-3 px-4 font-semibold bg-secondary text-black rounded-[5px] flex items-center justify-between"
                onClick={handleCategoryClick}
              >
                <span className="font-semibold truncate">
                  {getDisplayText(filters.category)}
                </span>
                <DropdownIcon isOpen={categoryDropdown.isOpen} />
              </button>

              <CategoryDropdown
                isOpen={categoryDropdown.isOpen}
                onCategoryChange={onCategoryChange}
                dropdownRef={categoryDropdown.ref}
                isMobile={true}
              />
            </div>
          </div>

          {/* Room Count Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Rooms</label>
            <div className="relative">
              <button
                ref={roomDropdown.toggleRef}
                onClick={handleRoomClick}
                className="w-full py-3 px-4 font-semibold bg-secondary text-black rounded-[5px] flex items-center justify-between"
              >
                <span className="font-semibold">
                  {getRoomDisplayText(filters.roomCount)}
                </span>
                <DropdownIcon isOpen={roomDropdown.isOpen} />
              </button>

              <RoomDropdown
                isOpen={roomDropdown.isOpen}
                onRoomChange={onRoomChange}
                dropdownRef={roomDropdown.ref}
                isMobile={true}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8">
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex-1 py-3 px-4 font-semibold bg-gray-200 hover:bg-gray-300 text-black rounded-[5px] transition-colors"
            >
              Clear Filters
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-[5px] transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

const MobileFilterBar: React.FC<{
  filters: FilterState;
  hasActiveFilters: boolean;
  onOpenModal: () => void;
  onClearFilters: () => void;
}> = ({ filters, hasActiveFilters, onOpenModal, onClearFilters }) => (
  <div className="lg:hidden px-4">
    <div className="flex flex-row items-center justify-center font-sans bg-white w-full py-2 rounded-full shadow-lg transition cursor-pointer gap-1">
      <button
        onClick={onOpenModal}
        className="p-2 ml-3 bg-blue-500 rounded-full text-white flex items-center justify-center relative flex-shrink-0"
      >
        <HiAdjustmentsHorizontal size={24} />
        {hasActiveFilters && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        )}
      </button>

      {/* Category Filter Display */}
      <div className="text-md flex-1 text-center relative min-w-0 mr-1">
        <button
          className="py-2 px-2 font-semibold bg-secondary text-black rounded-[5px] w-full flex items-center justify-between min-w-0"
          onClick={onOpenModal}
        >
          <span className="font-semibold truncate text-sm">
            {getDisplayText(filters.category)}
          </span>
          <span className="pl-2 flex-shrink-0">
            <svg
              width={16}
              height={16}
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
          onClick={onOpenModal}
          className="py-2 px-2 font-semibold bg-secondary text-black rounded-[5px] flex items-center justify-between whitespace-nowrap"
        >
          <span className="font-semibold text-sm">
            {getMobileRoomDisplayText(filters.roomCount)}
          </span>
          <span className="pl-2">
            <svg
              width={16}
              height={16}
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
          onClick={onClearFilters}
          className="py-2 px-2 mr-3 font-semibold bg-gray-200 hover:bg-gray-300 text-black rounded-[5px] text-xs transition-colors flex-shrink-0"
        >
          Clear
        </button>
      )}
    </div>
  </div>
);

const DesktopFilterBar: React.FC<{
  filters: FilterState;
  hasActiveFilters: boolean;
  categoryDropdown: any;
  roomDropdown: any;
  onCategoryChange: (category: string) => void;
  onRoomChange: (roomCount: number) => void;
  onClearFilters: () => void;
}> = ({
  filters,
  hasActiveFilters,
  categoryDropdown,
  roomDropdown,
  onCategoryChange,
  onRoomChange,
  onClearFilters,
}) => {
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

  return (
    <div className="hidden lg:flex flex-row items-center justify-center font-sans bg-white w-auto py-2 rounded-full shadow-lg transition cursor-pointer gap-4 max-w-4xl mx-auto">
      <div className="p-2 ml-3 bg-blue-500 rounded-full text-white flex items-center justify-center">
        <HiAdjustmentsHorizontal size={24} />
      </div>

      {/* Category Filter */}
      <div className="text-md flex-1 text-center relative mr-4 min-w-0">
        <button
          ref={categoryDropdown.toggleRef}
          className="py-2 px-4 font-semibold bg-secondary text-black rounded-[5px] w-full flex items-center justify-between min-w-0"
          onClick={handleCategoryClick}
        >
          <span className="font-semibold truncate">
            {getDisplayText(filters.category)}
          </span>
          <span className="pl-4 flex-shrink-0">
            <DropdownIcon isOpen={categoryDropdown.isOpen} />
          </span>
        </button>

        {categoryDropdown.isOpen && (
          <div
            ref={categoryDropdown.ref}
            className="absolute z-40 mt-4 w-64 rounded-md bg-white shadow-lg dark:bg-dark-2 py-2 max-h-60 overflow-y-auto"
          >
            <UserMenuItem
              onClick={() => onCategoryChange('')}
              label="All Categories"
            />
            {categories.map((item) => (
              <UserMenuItem
                key={item.label}
                onClick={() => onCategoryChange(item.label)}
                label={getCategoryDisplayName(item.label)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Room Count Filter */}
      <div className="text-md text-center relative flex-shrink-0">
        <button
          ref={roomDropdown.toggleRef}
          onClick={handleRoomClick}
          className="py-2 px-4 font-semibold bg-secondary text-black rounded-[5px] w-full flex items-center justify-between whitespace-nowrap"
        >
          <span className="font-semibold">
            {getRoomDisplayText(filters.roomCount)}
          </span>
          <span className="pl-4">
            <DropdownIcon isOpen={roomDropdown.isOpen} />
          </span>
        </button>

        {roomDropdown.isOpen && (
          <div
            ref={roomDropdown.ref}
            className="absolute right-0 z-40 mt-4 w-48 rounded-md bg-white shadow-lg dark:bg-dark-2 py-2"
          >
            <UserMenuItem
              onClick={() => onRoomChange(0)}
              label="All Rooms"
            />
            {ROOM_OPTIONS.map((roomCount) => (
              <UserMenuItem
                key={roomCount}
                onClick={() => onRoomChange(roomCount)}
                label={getRoomDisplayText(roomCount)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="py-2 px-4 mr-3 font-semibold bg-gray-200 hover:bg-gray-300 text-black rounded-[5px] text-sm transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  );
};

// Main component
const Filter: React.FC<FilterProps> = ({ setFilteredListings }) => {
  const [showMobileModal, setShowMobileModal] = useState<boolean>(false);
  const categoryDropdown = useClickOutside(false);
  const roomDropdown = useClickOutside(false);

  const {
    filters,
    updateCategory,
    updateRoomCount,
    clearFilters,
    hasActiveFilters,
  } = useFilterState(setFilteredListings);

  const handleCategoryChange = (category: string) => {
    updateCategory(category);
    categoryDropdown.setIsOpen(false);
  };

  const handleRoomCountChange = (roomCount: number) => {
    updateRoomCount(roomCount);
    roomDropdown.setIsOpen(false);
  };

  return (
    <>
      <div className="pt-9">
        <MobileFilterBar
          filters={filters}
          hasActiveFilters={hasActiveFilters}
          onOpenModal={() => setShowMobileModal(true)}
          onClearFilters={clearFilters}
        />

        <DesktopFilterBar
          filters={filters}
          hasActiveFilters={hasActiveFilters}
          categoryDropdown={categoryDropdown}
          roomDropdown={roomDropdown}
          onCategoryChange={handleCategoryChange}
          onRoomChange={handleRoomCountChange}
          onClearFilters={clearFilters}
        />
      </div>

      <MobileFilterModal
        isOpen={showMobileModal}
        onClose={() => setShowMobileModal(false)}
        filters={filters}
        categoryDropdown={categoryDropdown}
        roomDropdown={roomDropdown}
        onCategoryChange={handleCategoryChange}
        onRoomChange={handleRoomCountChange}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />
    </>
  );
};

export default Filter;