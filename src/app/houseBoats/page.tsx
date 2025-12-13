'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Container from '../components/Misc/Container';
import ListingCard from '../components/ListingCard/ListingCard';
import EmptyState from '../components/Misc/EmptyState';
import useSWR from 'swr';
import BoatsEmptyState from './BoatsEmptyState';
import ListingCardSkeleton from '../components/ListingCard/ListingCardSkeleton';
import GetAvailableHouseBoats from '../actions/GetAvailableHouseBoats/GetAvailableHouseBoats';

const Page = () => {
  const searchParams = useSearchParams();

  const categoryFromUrl = Number(searchParams?.get('category')) || 0;
  const roomCountFromUrl = Number(searchParams?.get('rooms')) || 0;
  const typeFromUrl = Number(searchParams?.get('type')) || 0;
  const startDateFromUrl = searchParams?.get('startDate');
  const endDateFromUrl = searchParams?.get('endDate');
  const cruiseFromUrl = Number(searchParams?.get('cruise')) || 0;
  
  const startDate = startDateFromUrl ? new Date(startDateFromUrl) : null;
  const endDate = endDateFromUrl ? new Date(endDateFromUrl) : null;

  const HandleGetAvailableHouseBoats = async () => {
    const data = await GetAvailableHouseBoats({
      TripModeId: typeFromUrl,
      CruiseTypeId: cruiseFromUrl,
      BoatCategoryId: categoryFromUrl,
      RoomCount: roomCountFromUrl,
      CheckInDate: startDate,
      CheckOutDate: endDate,
      Skip: 0,
      Take: 10,
    });
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Add placeholder for boats without images
    const processedData = data.map((boat: any) => ({
      ...boat,
      boatImage: boat.boatImage || '/placeholder-boat.jpg',
    }));
    
    return processedData;
  };

  const cacheKey = `boats-${categoryFromUrl}-${roomCountFromUrl}-${typeFromUrl}-${cruiseFromUrl}-${startDateFromUrl}-${endDateFromUrl}`;

  const { data: listings, error, isLoading } = useSWR(
    cacheKey,
    HandleGetAvailableHouseBoats,
    { 
      refreshInterval: 25 * 60 * 1000,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  if (isLoading) {
    return (
      <Container>
        <div className="pb-20 pt-40 lg:pt-28">
          <div className="items-center">
            <ListingCardSkeleton />
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    console.error('Error loading boats:', error);
    return (
      <Container>
        <div className="pb-20 pt-40 lg:pt-28">
          <EmptyState 
            showReset 
            title="Something went wrong" 
            subtitle="Please try again later" 
          />
        </div>
      </Container>
    );
  }

  if (!listings || !Array.isArray(listings) || listings.length === 0) {
    return (
      <Container>
        <div className="pb-20 pt-40 lg:pt-28">
          <div className="pt-12 md:pt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
            <BoatsEmptyState showReset={true} />
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="pb-20 pt-40 lg:pt-28">
        <div className="pt-12 md:pt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
          {listings.map((listing: any) => (
            <ListingCard key={listing.boatId} data={listing} />
          ))}
        </div>
      </div>
    </Container>
  );
};

export default Page;