'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Container from '../components/Misc/Container';
import ListingCard from '../components/ListingCard/ListingCard';
import BoatsEmptyState from './BoatsEmptyState';
import ListingCardSkeleton from '../components/ListingCard/ListingCardSkeleton';
import GetAvailableHouseBoats from '../actions/GetAvailableHouseBoats/GetAvailableHouseBoats';
import useSWR from 'swr';

const HouseBoatsContent = () => {
  const searchParams = useSearchParams();

  const categoryFromUrl = Number(searchParams?.get('category')) || 0;
  const roomCountFromUrl = Number(searchParams?.get('rooms')) || 0;
  const typeFromUrl = Number(searchParams?.get('type')) || 0;
  const startDateFromUrl = searchParams?.get('startDate');
  const endDateFromUrl = searchParams?.get('endDate');
  const cruiseFromUrl = Number(searchParams?.get('cruise')) || 0;

  const startDate = startDateFromUrl ? new Date(startDateFromUrl) : null;
  const endDate = endDateFromUrl ? new Date(endDateFromUrl) : null;

  const [paginationLoading, setPaginationLoading] = useState(false);
  const [allListings, setAllListings] = useState<any[]>([]);
  const [skip, setSkip] = useState(0);
  const take = 27;
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);
  const isInitializedRef = useRef(false);

  const cacheKey = `boats-${categoryFromUrl}-${roomCountFromUrl}-${typeFromUrl}-${cruiseFromUrl}-${startDateFromUrl}-${endDateFromUrl}`;

  const fetchInitialBoats = async () => {
    const result = await GetAvailableHouseBoats({
      TripModeId: typeFromUrl,
      CruiseTypeId: cruiseFromUrl,
      BoatCategoryId: categoryFromUrl,
      RoomCount: roomCountFromUrl,
      CheckInDate: startDate,
      CheckOutDate: endDate,
      Skip: 0,
      Take: take,
    });

    if (result && result.data && result.data.items && result.data.items.length > 0) {
      const processedData = result.data.items.map((boat: any) => ({
        ...boat,
        boatImage: boat.boatImage || '/placeholder-boat.jpg',
      }));

      return {
        items: processedData,
        totalResults: result.data.totalResults,
      };
    }

    return { items: [], totalResults: 0 };
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
    setAllListings([]);
    setSkip(0);
    setHasMore(true);
    isFetchingRef.current = false;
    isInitializedRef.current = false;
  }, [cacheKey]);

  useEffect(() => {
    if (initialData && !isInitializedRef.current) {
      if (initialData.items.length > 0) {
        setAllListings(initialData.items);
        setHasMore(initialData.items.length < initialData.totalResults);
        setSkip(take);
      } else {
        setAllListings([]);
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
            CheckInDate: startDate,
            CheckOutDate: endDate,
            Skip: skip,
            Take: take,
          });

          if (result && result.data && result.data.items && result.data.items.length > 0) {
            const processedData = result.data.items.map((boat: any) => ({
              ...boat,
              boatImage: boat.boatImage || '/placeholder-boat.jpg',
            }));

            setAllListings((prev) => {
              const updated = [...prev, ...processedData];
              setHasMore(updated.length < result.data.totalResults);
              return updated;
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
    if (isLoading || paginationLoading || !hasMore || allListings.length === 0) return;

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
  }, [isLoading, paginationLoading, hasMore, allListings.length, take]);

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

  if (!allListings || allListings.length === 0) {
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
  return (
    <Container>
      <div className="pb-20 pt-40 lg:pt-28">
        <div className="pt-12 md:pt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
          {allListings.map((listing: any) => (
            <ListingCard
              key={listing.boatId}
              data={listing}
              startDate={startDateFromUrl}
              endDate={endDateFromUrl}
              cruiseTypeId={cruiseFromUrl}
              bookingTypeId={typeFromUrl}
            />
          ))}
        </div>

        {allListings.length > 0 && (
          <div ref={observerRef} className="w-full">
            {paginationLoading ? (
              <div className="pt-12 md:pt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <ListingCardSkeleton key={i} />
                ))}
              </div>
            ) : !hasMore && allListings.length > 0 ? (
              <div className="text-gray-400 w-full text-center py-8">No more boats available</div>
            ) : null}
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