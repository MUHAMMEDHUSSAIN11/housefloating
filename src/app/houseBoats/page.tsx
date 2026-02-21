'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Container from '../components/Misc/Container';
import ListingCard from '../components/ListingCard/ListingCard';
import BoatsEmptyState from './BoatsEmptyState';
import ListingCardSkeleton from '../components/ListingCard/ListingCardSkeleton';
import GetAvailableHouseBoats from '../actions/GetAvailableHouseBoats/GetAvailableHouseBoats';
import useSWR from 'swr';
import { CheckCircle, Sparkles } from 'lucide-react';

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

  const fetchInitialBoats = async () => {
    const result = await GetAvailableHouseBoats({
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

  if (isLoading) {
    return (
      <Container>
        <div className="pb-20 pt-40 lg:pt-28">
          <div className="pt-12 md:pt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="pb-20 pt-40 lg:pt-28">
          <div className="pt-12 md:pt-8">
            <div className="text-red-500 text-center py-8">
              Failed to load boats. Please try again.
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (!listing.exactMatch.length && !listing.greaterThanMatch.length) {
    return (
      <Container>
        <div className="w-full h-screen">
          <div className="w-full h-full flex justify-center items-center">
            <BoatsEmptyState showReset={true} />
          </div>
        </div>
      </Container>
    );
  }

  const totalListingsCount = listing.exactMatch.length + listing.greaterThanMatch.length;

  return (
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