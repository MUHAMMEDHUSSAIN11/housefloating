import { Metadata } from 'next';
import EmptyState from '@/app/components/Misc/EmptyState';
import ListingClient from './ListingClient';
import GetBoatById from '@/app/actions/GetBoatById/GetBoatById';
import { BookingType } from '@/app/enums/enums';
import { headers } from 'next/headers';

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
  maxGuestCountPerRoomForNight: number;
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

  // Use headers to get the current host dynamically
  const hostArr = (await headers()).get('host')?.split(':') || ['housefloating.com'];
  const host = hostArr[0];
  const protocol = 'https';
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
  const description = `Luxury ${boatData.boatCategory} houseboat with ${boatData.bedroomCount} bedrooms. Boarding at ${boatData.boardingPoint}. Book now!`;

  // Get the LAST image as requested by the user
  const images = boatData.boatImages || [];
  let imageUrl = images.length > 0 ? images[images.length - 1] : '/placeholder-boat.jpg';

  // Ensure the image URL is absolute and clearly formatted for WhatsApp/Facebook scrapers
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
          width: 1200,
          height: 630,
          type: 'image/jpeg',
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
  const roomsParam = resolvedSearchParams.rooms as string;
  const adultCountParam = resolvedSearchParams.adultCount as string;

  const startDate = startDateParam ? new Date(startDateParam) : null;
  const endDate = endDateParam ? new Date(endDateParam) : null;
  const cruiseTypeId = cruiseTypeIdParam ? Number(cruiseTypeIdParam) : null;
  const bookingTypeId = bookingTypeIdParam ? Number(bookingTypeIdParam) : null;
  const searchedRoomCount = roomsParam ? Number(roomsParam) : undefined;
  const searchedAdultCount = adultCountParam ? Number(adultCountParam) : undefined;

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
        searchedRoomCount={searchedRoomCount}
        searchedAdultCount={searchedAdultCount}
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