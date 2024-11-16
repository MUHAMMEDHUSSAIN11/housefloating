'use client';

import React, { useState, useEffect } from 'react';
import Container from '../components/Misc/Container';
import ListingCard from '../components/ListingCard/ListingCard';
import EmptyState from '../components/Misc/EmptyState';
import useSWR from 'swr';
import getListings from '../actions/getListings';
import Spinner from '../components/Misc/Spinner';
import Filter from '../components/Misc/Filter';

const Page = () => {
  const [sortedListings, setSortedListings] = useState<any[]>([]); // State for sorted listings
  const [sortCriteria, setSortCriteria] = useState<{ category: string; roomCount: number }>({
    category: '',
    roomCount: 2,
  });

  const { data: listings, error, isValidating, isLoading } = useSWR('actions', getListings, {
    refreshInterval: 25 * 60 * 1000,
  });

  const sortListings = (category: string, roomCount: number) => {
    let updatedListings = [...(listings || [])];
  
    updatedListings.sort((a, b) => {
      // Sort by category first (if category exists)
      if (category) {
        if (a.category === category && b.category !== category) return -1;
        if (b.category === category && a.category !== category) return 1;
      }
  
      if (roomCount !== undefined) {
        const aRoomCount = a.roomCount || 0; // Ensure it's a number (default to 0)
        const bRoomCount = b.roomCount || 0; // Ensure it's a number (default to 0)
  
        if (aRoomCount === roomCount && bRoomCount !== roomCount) return -1; // Prioritize the matching room count
        if (bRoomCount === roomCount && aRoomCount !== roomCount) return 1; // Prioritize the matching room count
        
        // Compare the room count numerically
        return aRoomCount - bRoomCount;
      }
  
      // Maintain original order if no condition applies
      return 0;
    });
  
    setSortedListings(updatedListings);
  };
  

  useEffect(() => {
    if (listings) {
      setSortedListings(listings); // Set initial listings
    }
  }, [listings]);

  useEffect(() => {
    sortListings(sortCriteria.category, sortCriteria.roomCount);
  }, [sortCriteria, listings]);

  if (isValidating || isLoading) {
    return (
      <div className="items-center">
        <Spinner />
      </div>
    );
  }

  if (!listings || !Array.isArray(listings)) {
    return <EmptyState showReset />;
  }

  return (
    <>
      <Container>
        <div className="pb-20 pt-16">
          <div className="flex flex-row items-center justify-center">
            <Filter
              setSortedListings={(category: string, roomCount: number) => {
                setSortCriteria({ category, roomCount });
              }}
            />
          </div>

          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-8">
            {sortedListings.length > 0 ? (
              sortedListings.map((listing: any) => (
                <ListingCard key={listing.id} data={listing} />
              ))
            ) : (
              <EmptyState  showReset={true}/>
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default Page;
