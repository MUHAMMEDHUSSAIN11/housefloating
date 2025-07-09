'use client'

import BoatsEmptyState from '@/app/houseBoats/BoatsEmptyState';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ListingCard from '../ListingCard/ListingCard';

interface VirtualizedListingGridProps {
  filteredListings: any[];
  itemHeight: number;
  containerHeight: number;
  itemsPerRow: number;
}

const VirtualizedListingGrid: React.FC<VirtualizedListingGridProps> = ({
  filteredListings,
  itemHeight = 300,
  containerHeight = 600,
  itemsPerRow = 3
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  // Calculate visible items
  const visibleItems = useMemo(() => {
    const totalRows = Math.ceil(filteredListings.length / itemsPerRow);
    const startRow = Math.floor(scrollTop / itemHeight);
    const endRow = Math.min(
      startRow + Math.ceil(containerHeight / itemHeight) + 1,
      totalRows
    );

    const items = [];
    for (let row = startRow; row < endRow; row++) {
      for (let col = 0; col < itemsPerRow; col++) {
        const index = row * itemsPerRow + col;
        if (index < filteredListings.length) {
          items.push({
            index,
            data: filteredListings[index],
            top: row * itemHeight,
            left: (col * 100) / itemsPerRow
          });
        }
      }
    }
    return items;
  }, [filteredListings, scrollTop, itemHeight, containerHeight, itemsPerRow]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const totalHeight = Math.ceil(filteredListings.length / itemsPerRow) * itemHeight;

  if (filteredListings.length === 0) {
    return <BoatsEmptyState showReset={true} />;
  }

  return (
    <div
      ref={setContainerRef}
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
      className="relative"
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ index, data, top, left }) => (
          <div
            key={data.docId || index}
            style={{
              position: 'absolute',
              top: `${top}px`,
              left: `${left}%`,
              width: `${100 / itemsPerRow}%`,
              height: `${itemHeight}px`,
              padding: '8px'
            }}
          >
            <ListingCard data={data} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualizedListingGrid;