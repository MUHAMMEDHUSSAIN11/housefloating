import React from 'react';
import { Metadata } from 'next';
import EmptyState from '@/app/components/Misc/EmptyState';
import ListingClient from './ListingClient';
import GetBoatById from '@/app/actions/GetBoatById/GetBoatById';
import { BookingType } from '@/app/enums/enums';

interface Prices {
  adultAddOnDayPrice: number
  adultAddonDayNightPrice: number
  adultAddonNightStayPrice: number;
  minimumRoomCount: number;
  roomPrice: number;
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
  bathroomCount: number;
  prices: Prices;
  availableRoomCount?: number;
  ownerEmail: string;
}

interface Iparams {
  listingid?: string;
}

const fetchBoatData = async (
  listingId: string,
  date: Date,
  cruiseTypeId: number,
  bookingTypeId: number | null
) => {
  const fetchedBoatData = await GetBoatById({
    BoatId: parseInt(listingId),
    Date: date,
    CruiseTypeId: cruiseTypeId,
    IsSharing: bookingTypeId === BookingType.sharing
  });
  return fetchedBoatData;
};

import { headers } from 'next/headers';

// ... (fetchBoatData stays same)

// Generate Metadata for Social Sharing (WhatsApp, etc.)
export async function generateMetadata(
  { params, searchParams }: {
    params: Promise<Iparams>,
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }
): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const listingId = resolvedParams.listingid;
  const startDateParam = resolvedSearchParams.startDate as string;
  const cruiseTypeIdParam = resolvedSearchParams.cruiseTypeId as string;
  const bookingTypeIdParam = resolvedSearchParams.bookingTypeId as string;

  // Use headers to get the current host dynamically (helps with QA/Prod environments)
  const host = (await headers()).get('host') || 'housefloating.com';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  if (!listingId || !startDateParam || !cruiseTypeIdParam) {
    return { title: 'Houseboat Listing' };
  }

  const boatData = await fetchBoatData(
    listingId,
    new Date(startDateParam),
    Number(cruiseTypeIdParam),
    bookingTypeIdParam ? Number(bookingTypeIdParam) : null
  );

  if (!boatData) {
    return { title: 'Boat Not Found' };
  }

  const title = `Houseboat ${boatData.boatCode} - ${boatData.boatCategory}`;
  const description = `Book the ${boatData.boatCode} ${boatData.boatCategory} houseboat at ${boatData.boardingPoint}. ${boatData.bedroomCount} Bedrooms available.`;

  // Ensure the image URL is absolute for WhatsApp/Social Scrapers
  let imageUrl = boatData.boatImages?.[0] || '/placeholder-boat.jpg';
  if (imageUrl && !imageUrl.startsWith('http')) {
    imageUrl = `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  }

  const canonicalUrl = `${baseUrl}/listings/${listingId}?startDate=${startDateParam}&cruiseTypeId=${cruiseTypeIdParam}`;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Housefloating',
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: `${boatData.boatCode} Houseboat`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: canonicalUrl,
    },
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    }
  };
}

const Listingpage = async ({
  params,
  searchParams
}: {
  params: Promise<Iparams>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const listingId = resolvedParams.listingid;

  const startDateParam = resolvedSearchParams.startDate as string;
  const endDateParam = resolvedSearchParams.endDate as string;
  const cruiseTypeIdParam = resolvedSearchParams.cruiseTypeId as string;
  const bookingTypeIdParam = resolvedSearchParams.bookingTypeId as string;

  const startDate = startDateParam ? new Date(startDateParam) : null;
  const endDate = endDateParam ? new Date(endDateParam) : null;
  const cruiseTypeId = cruiseTypeIdParam ? Number(cruiseTypeIdParam) : null;
  const bookingTypeId = bookingTypeIdParam ? Number(bookingTypeIdParam) : null;

  const hasRequiredParams = !!(listingId && startDateParam && cruiseTypeIdParam && startDate && cruiseTypeId);

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

  try {
    const fetchedBoatData = await fetchBoatData(listingId!, startDate!, cruiseTypeId!, bookingTypeId);

    if (!fetchedBoatData) {
      return (
        <div className="w-full h-screen">
          <div className="w-full h-full flex justify-center items-center">
            <EmptyState showReset={true} />
          </div>
        </div>
      );
    }

    return (
      <ListingClient
        boatDetails={fetchedBoatData}
        startDate={startDate!}
        endDate={endDate!}
        cruiseTypeId={cruiseTypeId!}
        bookingTypeId={bookingTypeId}
      />
    );
  } catch (error) {
    console.error('Error fetching boat data:', error);
    return (
      <div className="w-full h-screen">
        <div className="w-full h-full flex justify-center items-center">
          <EmptyState showReset={true} />
        </div>
      </div>
    );
  }
};

export default Listingpage;