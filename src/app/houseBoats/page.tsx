'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Container from '../components/Misc/Container';
import ListingCard from '../components/ListingCard/ListingCard';
import BoatsEmptyState from './BoatsEmptyState';
import ListingCardSkeleton from '../components/ListingCard/ListingCardSkeleton';
import GetAvailableHouseBoats from '../actions/GetAvailableHouseBoats/GetAvailableHouseBoats';
import useSWR from 'swr';
import { CheckCircle, Sparkles } from 'lucide-react';

// WhatsApp SVG icon
const WhatsAppIcon = () => (
  <svg viewBox="0 0 32 32" fill="currentColor" className="w-6 h-6">
    <path d="M16 0C7.164 0 0 7.163 0 16c0 2.82.736 5.46 2.02 7.746L0 32l8.494-2.227A15.94 15.94 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 01-6.784-1.854l-.487-.29-5.04 1.32 1.348-4.913-.318-.504A13.27 13.27 0 012.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.9c-.398-.2-2.355-1.163-2.72-1.295-.365-.133-.632-.2-.899.2-.266.398-1.03 1.295-1.264 1.562-.232.266-.465.3-.863.1-.398-.2-1.68-.619-3.2-1.975-1.182-1.055-1.98-2.358-2.213-2.756-.232-.398-.025-.613.175-.812.18-.178.398-.465.598-.698.2-.232.265-.398.398-.664.133-.266.066-.498-.033-.698-.1-.2-.9-2.165-1.233-2.963-.325-.779-.655-.673-.9-.686-.232-.012-.498-.015-.765-.015-.266 0-.698.1-1.064.498-.365.398-1.396 1.364-1.396 3.328s1.43 3.86 1.628 4.127c.2.266 2.813 4.295 6.815 6.026.952.411 1.695.657 2.274.84.955.305 1.824.262 2.51.159.766-.114 2.355-.963 2.688-1.893.332-.93.332-1.727.232-1.893-.1-.165-.365-.265-.763-.465z" />
  </svg>
);


const HouseBoatsContent = () => {
  const searchParams = useSearchParams();

  const categoryFromUrl = Number(searchParams?.get('category')) || 0;
  const roomCountFromUrl = Number(searchParams?.get('rooms')) || 0;
  const adultCountFromUrl = Number(searchParams?.get('adultCount')) || 0;
  const typeFromUrl = Number(searchParams?.get('type')) || 0;
  const startDateFromUrl = searchParams?.get('startDate');
  const endDateFromUrl = searchParams?.get('endDate');
  const cruiseFromUrl = Number(searchParams?.get('cruise')) || 0;

  const startDate = startDateFromUrl ? new Date(startDateFromUrl) : null;
  const endDate = endDateFromUrl ? new Date(endDateFromUrl) : null;

  const [paginationLoading, setPaginationLoading] = useState(false);
  const [listing, setListing] = useState<{
    exactMatch: any[];
    greaterThanMatch: any[];
  }>({
    exactMatch: [],
    greaterThanMatch: [],
  });
  const [skip, setSkip] = useState(0);
  const take = 27;
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);
  const isInitializedRef = useRef(false);

  const cacheKey = `boats-${categoryFromUrl}-${roomCountFromUrl}-${adultCountFromUrl}-${typeFromUrl}-${cruiseFromUrl}-${startDateFromUrl}-${endDateFromUrl}`;


  const openWhatsApp = useCallback(() => {
    // Build a friendly auto-filled message from search params
    const cruiseLabel = cruiseFromUrl === 1 ? 'Day Cruise' : cruiseFromUrl === 2 ? 'Day & Night' : cruiseFromUrl === 3 ? 'Night Stay' : '';
    const typeLabel = typeFromUrl === 1 ? 'Private' : typeFromUrl === 2 ? 'Sharing' : '';

    const parts: string[] = ['Hi Housefloating Team!\n\nI am looking for a houseboat with the following preferences:'];
    if (startDateFromUrl) parts.push(`* Check-in Date: ${new Date(startDateFromUrl).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`);
    if (endDateFromUrl)   parts.push(`* Check-out Date: ${new Date(endDateFromUrl).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`);
    if (cruiseLabel)      parts.push(`* Cruise Type: ${cruiseLabel}`);
    if (typeLabel)        parts.push(`* Booking Type: ${typeLabel}`);
    if (roomCountFromUrl) parts.push(`* Rooms: ${roomCountFromUrl}`);
    if (adultCountFromUrl) parts.push(`* Guests: ${adultCountFromUrl}`);
    parts.push('\nPlease help me find the best available option. Thank you!');

    const message = encodeURIComponent(parts.join('\n'));
    window.open(`https://wa.me/919207777911?text=${message}`, '_blank');
  }, [startDateFromUrl, endDateFromUrl, cruiseFromUrl, typeFromUrl, roomCountFromUrl, adultCountFromUrl]);

  const fetchInitialBoats = async () => {
    const result:any = await GetAvailableHouseBoats({
      TripModeId: typeFromUrl,
      CruiseTypeId: cruiseFromUrl,
      BoatCategoryId: categoryFromUrl,
      RoomCount: roomCountFromUrl,
      GuestCount: adultCountFromUrl,
      CheckInDate: startDate,
      CheckOutDate: endDate,
      Skip: 0,
      Take: take,
    });

    if (result && result.data && result.data.totalCount > 0) {
      const processedExact = (result.data.exactMatch || []).map((boat: any) => ({
        ...boat,
        boatImage: boat.boatImage || '/placeholder-boat.jpg',
      }));
      const processedGreater = (result.data.greaterThanMatch || []).map((boat: any) => ({
        ...boat,
        boatImage: boat.boatImage || '/placeholder-boat.jpg',
      }));

      return {
        exactMatch: processedExact,
        greaterThanMatch: processedGreater,
        totalCount: result.data.totalCount,
      };
    }

    return { exactMatch: [], greaterThanMatch: [], totalCount: 0 };
  };

  const { data: initialData, error, isLoading } = useSWR(
    cacheKey,
    fetchInitialBoats,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
      dedupingInterval: 5000,
    }
  );

  useEffect(() => {
    setListing({ exactMatch: [], greaterThanMatch: [] });
    setSkip(0);
    setHasMore(true);
    isFetchingRef.current = false;
    isInitializedRef.current = false;
  }, [cacheKey]);

  useEffect(() => {
    if (initialData && !isInitializedRef.current) {
      const totalItems = initialData.exactMatch.length + initialData.greaterThanMatch.length;
      if (totalItems > 0) {
        setListing({
          exactMatch: initialData.exactMatch,
          greaterThanMatch: initialData.greaterThanMatch
        });
        setHasMore(totalItems >= take && totalItems < initialData.totalCount);
        setSkip(take);
      } else {
        setListing({ exactMatch: [], greaterThanMatch: [] });
        setHasMore(false);
        setSkip(0);
      }
      isFetchingRef.current = false;
      isInitializedRef.current = true;
    }
  }, [initialData, take]);

  useEffect(() => {
    if (skip > 0 && skip % take === 0 && hasMore && !isFetchingRef.current && isInitializedRef.current) {
      const fetchData = async () => {
        isFetchingRef.current = true;
        setPaginationLoading(true);

        try {
          const result = await GetAvailableHouseBoats({
            TripModeId: typeFromUrl,
            CruiseTypeId: cruiseFromUrl,
            BoatCategoryId: categoryFromUrl,
            RoomCount: roomCountFromUrl,
            GuestCount: adultCountFromUrl,
            CheckInDate: startDate,
            CheckOutDate: endDate,
            Skip: skip,
            Take: take,
          });

          if (result && result.data && result.data.totalCount > 0) {
            const processedExact = (result.data.exactMatch || []).map((boat: any) => ({
              ...boat,
              boatImage: boat.boatImage || '/placeholder-boat.jpg',
            }));
            const processedGreater = (result.data.greaterThanMatch || []).map((boat: any) => ({
              ...boat,
              boatImage: boat.boatImage || '/placeholder-boat.jpg',
            }));

            setListing((prev) => {
              const updatedExact = [...prev.exactMatch, ...processedExact];
              const updatedGreater = [...prev.greaterThanMatch, ...processedGreater];
              const currentTotal = updatedExact.length + updatedGreater.length;
              const newItemsCount = processedExact.length + processedGreater.length;
              setHasMore(newItemsCount >= take && currentTotal < result.data.totalCount);
              return {
                exactMatch: updatedExact,
                greaterThanMatch: updatedGreater
              };
            });
          } else {
            setHasMore(false);
          }
        } catch (error: any) {
          console.error('Error loading more boats:', error);
          setHasMore(false);
        } finally {
          setPaginationLoading(false);
          isFetchingRef.current = false;
        }
      };

      fetchData();
    }
  }, [skip]);

  useEffect(() => {
    if (isLoading || paginationLoading || !hasMore || (listing.exactMatch.length === 0 && listing.greaterThanMatch.length === 0)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !paginationLoading && hasMore && !isFetchingRef.current) {
          setSkip((prev) => prev + take);
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1,
      }
    );

    const currentObserver = observerRef.current;
    if (currentObserver) observer.observe(currentObserver);

    return () => {
      if (currentObserver) observer.unobserve(currentObserver);
    };
  }, [isLoading, paginationLoading, hasMore, listing.exactMatch.length, listing.greaterThanMatch.length, take]);

  // Floating WhatsApp Button//
  const FloatingButtons = (
    <div className="fixed bottom-42 md:bottom-16 right-4 z-50 flex flex-col items-center gap-3">
      <button
        onClick={openWhatsApp}
        title="Chat with us on WhatsApp"
        className="flex items-center justify-center w-13 h-13 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#1ebe5d] transition-all duration-200 hover:scale-110 active:scale-95"
        style={{ width: '46px', height: '46px' }}
      >
        <WhatsAppIcon />
      </button>
    </div>
  );
  // Floating WhatsApp Button//

  if (isLoading) {
    return (
      <>
        <Container>
          <div className="pb-20 pt-40 lg:pt-28">
            <div className="pt-12 md:pt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <ListingCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </Container>
        {FloatingButtons}
      </>
    );
  }

  if (error) {
    return (
      <>
        <Container>
          <div className="pb-20 pt-40 lg:pt-28">
            <div className="pt-12 md:pt-8">
              <div className="text-red-500 text-center py-8">
                Failed to load boats. Please try again.
              </div>
            </div>
          </div>
        </Container>
        {FloatingButtons}
      </>
    );
  }

  if (!listing.exactMatch.length && !listing.greaterThanMatch.length) {
    return (
      <>
        <Container>
          <div className="w-full h-screen">
            <div className="w-full h-full flex justify-center items-center">
              <BoatsEmptyState showReset={true} />
            </div>
          </div>
        </Container>
        {FloatingButtons}
      </>
    );
  }

  const totalListingsCount = listing.exactMatch.length + listing.greaterThanMatch.length;

  return (
    <>
    <Container>
      <div className="pb-20 pt-40 lg:pt-36">

        {listing.exactMatch.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-5 bg-blue-50 w-fit px-3 py-1 rounded-3xl">
              <CheckCircle className="text-blue-600" size={20} />
              <h2 className="text-sm md:text-xl lg:text-2xl font-semibold text-neutral-700 tracking-tight">
                Exact Matches
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {listing.exactMatch.map((listing: any) => (
                <ListingCard
                  key={listing.boatId}
                  data={listing}
                  roomCountForSearch={roomCountFromUrl}
                  guestCountForSearch={adultCountFromUrl}
                  startDate={startDateFromUrl}
                  endDate={endDateFromUrl}
                  cruiseTypeId={cruiseFromUrl}
                  bookingTypeId={typeFromUrl}
                  exactMatch={true}
                />
              ))}
            </div>
          </div>
        )}

        {listing.greaterThanMatch.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-5 bg-blue-50 w-fit px-3 py-1 rounded-3xl">
              <Sparkles className="text-blue-500" size={20} />
              <h2 className="text-sm md:text-xl lg:text-2xl font-semibold text-neutral-700 tracking-tight">
                Better Matches
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {listing.greaterThanMatch.map((listing: any) => (
                <ListingCard
                  key={listing.boatId}
                  data={listing}
                  roomCountForSearch={roomCountFromUrl}
                  guestCountForSearch={adultCountFromUrl}
                  startDate={startDateFromUrl}
                  endDate={endDateFromUrl}
                  cruiseTypeId={cruiseFromUrl}
                  bookingTypeId={typeFromUrl}
                />
              ))}
            </div>
          </div>
        )}

        {hasMore && totalListingsCount > 0 && (
          <div ref={observerRef} className="w-full">
            {paginationLoading && (
              <div className="pt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <ListingCardSkeleton key={i} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Container>
    {FloatingButtons}
    </>
  );
};

import { Suspense } from 'react';

const Page = () => {
  return (
    <Suspense fallback={
      <Container>
        <div className="pb-20 pt-40 lg:pt-28">
          <div className="pt-12 md:pt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </Container>
    }>
      <HouseBoatsContent />
    </Suspense>
  );
};

export default Page;