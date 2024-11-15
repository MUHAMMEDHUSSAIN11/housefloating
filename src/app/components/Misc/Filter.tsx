'use client';

import React, { useState } from 'react';
import { categories } from './SortCategories';

const Filter = ({ setSortedListings }: { setSortedListings: (category: string, roomCount: number) => void }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedRoomCount, setSelectedRoomCount] = useState<number>(2);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const category = event.target.value;
    setSelectedCategory(category);
    setSortedListings(category, selectedRoomCount);
  };

  const handleRoomCountChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const roomCount = parseInt(event.target.value);
    console.log("roomcount", roomCount);
    setSelectedRoomCount(roomCount);
    setSortedListings(selectedCategory, roomCount);
  };

  return (
    <div className="flex flex-row items-center justify-center mt-9 font-sans bg-white w-auto py-2 rounded-full shadow-md transition cursor-pointer">
      <div className="flex flex-row items-center justify-between w-full">
        {/* Category Dropdown */}
        <div className="text-md px-6 flex-1 text-center">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="py-2 px-4"
          >
            <option value="">Sort by Category</option>
            {categories.map((item) => (
              <option key={item.label} value={item.label}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* Room Count Dropdown */}
        <div className="text-md px-6 text-center">
          <select
            value={selectedRoomCount}
            onChange={handleRoomCountChange}
            className="py-2 px-4"
          >
            <option value="">Sort by Room Count</option>
            <option value="1">1 Room</option>
            <option value="2">2 Rooms</option> {/* Default matches initial state */}
            <option value="3">3 Rooms</option>
            <option value="4">4 Rooms</option>
            <option value="5">5 Rooms</option>
          </select>

        </div>
      </div>
    </div>
  );
};

export default Filter;
