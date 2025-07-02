'use client';

import React, { useState, useEffect } from 'react';
import Container from '../components/Misc/Container';
import ListingCard from '../components/ListingCard/ListingCard';
import EmptyState from '../components/Misc/EmptyState';
import useSWR from 'swr';
import getListings from '../actions/getListings';
import Filter from '../components/Misc/Filter';
import BoatsEmptyState from './BoatsEmptyState';
import ListingCardSkeleton from '../components/ListingCard/ListingCardSkeleton';

const Page = () => {
  const [filteredListings, setFilteredListings] = useState<any[]>([]);
  const [filterCriteria, setFilterCriteria] = useState<{ category: string; roomCount: number }>({
    category: '',
    roomCount: 0, // Changed to 0 to show all by default
  });

  const { data: listings, error, isValidating, isLoading } = useSWR('actions', getListings, {
    refreshInterval: 25 * 60 * 1000,
  });

  const filterListings = (category: string, roomCount: number) => {
    if (!listings) return;

    let filtered = [...listings];

    // Filter by category if specified
    if (category && category !== '') {
      filtered = filtered.filter(listing => listing.category === category);
    }

    // Filter by room count if specified (greater than 0)
    if (roomCount > 0) {
      filtered = filtered.filter(listing => {
        const listingRoomCount = listing.roomCount || 0;
        return listingRoomCount === roomCount;
      });
    }

    setFilteredListings(filtered);
  };

  useEffect(() => {
    if (listings) {
      setFilteredListings(listings); // Show all listings initially
    }
  }, [listings]);

  useEffect(() => {
    filterListings(filterCriteria.category, filterCriteria.roomCount);
  }, [filterCriteria, listings]);

  if (isValidating || isLoading) {
    return (
      <div className="items-center">
        <ListingCardSkeleton />
      </div>
    );
  }

  if (!listings || !Array.isArray(listings)) {
    return <EmptyState showReset />;
  }

  return (
    <>
      <Container>
        <div className="pb-20 pt-44 md:pt-24">
          <div className="flex flex-row items-center justify-center">
            <Filter
              setFilteredListings={(category: string, roomCount: number) => {
                setFilterCriteria({ category, roomCount });
              }}
            />
          </div>
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-8">
            {filteredListings.length > 0 ? (
              filteredListings.map((listing: any) => (
                <ListingCard key={listing.boatId} data={listing} />
              ))
            ) : (
              <BoatsEmptyState showReset={true} />
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default Page;