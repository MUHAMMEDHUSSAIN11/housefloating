'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import EmptyState from '@/app/components/Misc/EmptyState';
import ListingClient from './ListingClient';
import useSWR from 'swr';
import GetBoatById from '@/app/actions/GetBoatById/GetBoatById';
import ListingSkeleton from './ListingSkeleton';
import { BookingType } from '@/app/enums/enums';

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
  maxAdultCount: number;
  minAdultCount: number;
  maxChildCount: number;
  bathroomCount: number;
  prices: Prices;
  availableRoomCount?: number;
}

interface Iparams {
  listingid?: string;
}

const fetchBoatData = async (
  listingId: string,
  date: Date,
  cruiseTypeId: number,
  bookingTypeId: number
) => {
  const fetchedBoatData = await GetBoatById({
    BoatId: parseInt(listingId),
    Date: date,
    CruiseTypeId: cruiseTypeId,
    IsSharing: bookingTypeId === BookingType.sharing
  });
  return fetchedBoatData;
};

const Listingpage = ({ params }: { params: Promise<Iparams> }) => {
  const searchParams = useSearchParams();
  const resolvedParams = React.use(params);
  const listingId = resolvedParams.listingid;

  const startDateParam = searchParams?.get('startDate');
  const endDateParam = searchParams?.get('endDate');
  const cruiseTypeIdParam = searchParams?.get('cruiseTypeId');
  const bookingTypeIdParam = searchParams?.get('bookingTypeId');

  const startDate = startDateParam ? new Date(startDateParam) : null;
  const endDate = endDateParam ? new Date(endDateParam) : null;
  const cruiseTypeId = cruiseTypeIdParam ? Number(cruiseTypeIdParam) : null;
  const bookingTypeId = bookingTypeIdParam ? Number(bookingTypeIdParam) : null;

  const hasRequiredParams = !!(listingId && startDateParam && cruiseTypeIdParam && startDate && cruiseTypeId);

  const cacheKey = hasRequiredParams
    ? `boat-${listingId}-${startDateParam}-${cruiseTypeId}`
    : null;

  const { data: fetchedBoatData, error, isLoading } = useSWR<BoatDetails>(
    cacheKey,
    () => fetchBoatData(listingId!, startDate!, cruiseTypeId!, bookingTypeId!),
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
      bookingTypeId={bookingTypeId}
    />
  );
};

export default Listingpage;