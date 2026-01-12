'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import EmptyState from '@/app/components/Misc/EmptyState';
import ListingClient from './ListingClient';
import useSWR from 'swr';
import GetBoatById from '@/app/actions/GetBoatById/GetBoatById';
import ListingSkeleton from './ListingSkeleton';

interface Prices {
  adultAddOnDayPrice: number
  adultAddonDayNightPrice: number
  adultAddonNightStayPrice: number;
  childAddOnDayPrice: number;
  childAddonDayNightPrice: number;
  childAddonNightStayPrice: number;
  dayPrice: number;
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
  maxAdulCount: number;
  minAdulCount: number;
  maxChildCount: number;
  bathroomCount: number;
  prices: Prices
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
  return fetchedBoatData;
};

const Listingpage = ({ params }: { params: Iparams }) => {
  const searchParams = useSearchParams();
  const listingId = params.listingid;

  const startDateParam = searchParams?.get('startDate');
  const endDateParam = searchParams?.get('endDate');
  const cruiseTypeIdParam = searchParams?.get('cruiseTypeId');

  const startDate = startDateParam ? new Date(startDateParam) : null;
  const endDate = endDateParam ? new Date(endDateParam) : null;
  const cruiseTypeId = cruiseTypeIdParam ? Number(cruiseTypeIdParam) : null;

  const hasRequiredParams = !!(listingId && startDateParam && cruiseTypeIdParam && startDate && cruiseTypeId);

  const cacheKey = hasRequiredParams
    ? `boat-${listingId}-${startDateParam}-${cruiseTypeId}`
    : null;

  const { data: fetchedBoatData, error, isLoading } = useSWR<BoatDetails>(
    cacheKey,
    () => fetchBoatData(listingId!, startDate!, cruiseTypeId!),
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
    <div className="w-full h-screen">
      <div className="w-full h-full flex justify-center items-center">
        <EmptyState showReset={true} />
      </div>
    </div>
  ) : (
    <ListingClient
      boatDetails={fetchedBoatData}
      startDate={startDate!}
      endDate={endDate!}
      cruiseTypeId={cruiseTypeId!}
    />
  );
};

export default Listingpage;