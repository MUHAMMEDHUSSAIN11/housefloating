'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import EmptyState from '@/app/components/Misc/EmptyState';
import ListingClient from './ListingClient';
import useSWR from 'swr';
import GetBoatById from '@/app/actions/GetBoatById/GetBoatById';
import ListingSkeleton from './ListingSkeleton';

interface Prices {
  adultAddOnDayPrice:number
  adultAddonDayNightPrice:number
  adultAddonNightStayPrice:number;
  childAddOnDayPrice:number;
  childAddonDayNightPrice:number;
  childAddonNightStayPrice:number;
  dayPrice:number;
}

export interface BoatDetails {
  boatId: number;
  boatCategoryId: number;
  boatCategory: string;
  boardingPoint: string;
  boatImages: string[];
  bedroomCount: number;
  boatCode: string;
  guestCount: number;
  maxAdulCount:number;
  minAdulCount:number;
  maxChildCount:number;
  bathroomCount:number;
  prices:Prices
}

interface Iparams {
  listingid?: string;
}

const fetchBoatData = async (
  listingId: string,
  date: Date,
  cruiseTypeId: number
) => {
  const fetchedBoatData = await GetBoatById({
    BoatId: parseInt(listingId),
    Date: date,
    CruiseTypeId: cruiseTypeId,
  });
  console.log("Fetched Boat Data:", fetchedBoatData);
  return fetchedBoatData;
};

const Listingpage = ({ params }: { params: Iparams }) => {
  const searchParams = useSearchParams();
  const listingId = params.listingid;
  
  const startDateParam = searchParams?.get('startDate');
  const cruiseTypeIdParam = searchParams?.get('cruiseTypeId');
  
  const date = startDateParam ? new Date(startDateParam) : null;
  const cruiseTypeId = cruiseTypeIdParam ? Number(cruiseTypeIdParam) : null;

  const hasRequiredParams = !!(listingId && startDateParam && cruiseTypeIdParam && date && cruiseTypeId);

  const cacheKey = hasRequiredParams 
    ? `boat-${listingId}-${startDateParam}-${cruiseTypeId}` 
    : null;

  const { data: fetchedBoatData, error, isLoading } = useSWR<BoatDetails>(
    cacheKey,
    () => fetchBoatData(listingId!, date!, cruiseTypeId!),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  if (!hasRequiredParams) {
    return (
      <div className='pt-40 md:pt-24 text-lg'>
        <EmptyState 
          title="Missing Information"
          subtitle="Please select a date and cruise type to view this listing."
          showReset 
        />
      </div>
    );
  }

  return isLoading ? (
    <div className='pt-40 md:pt-24 text-lg'>
      <ListingSkeleton />
    </div>
  ) : !fetchedBoatData || error ? (
    <div className='pt-40 md:pt-24 text-lg'>
      <EmptyState showReset />
    </div>
  ) : (
    <ListingClient boatDetails={fetchedBoatData} date={date} cruiseTypeId={cruiseTypeId}/>
  );
};

export default Listingpage;