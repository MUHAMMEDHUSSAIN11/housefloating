'use client';

import React, { useState } from 'react'
import Container from '../components/Misc/Container';
import ListingCard from '../components/ListingCard/ListingCard';
import EmptyState from '../components/Misc/EmptyState';
import useSWR from 'swr';
import getListings from '../actions/getListings';
import Spinner from '../components/Misc/Spinner';
import Sortcategories from '../components/Misc/SortCategories';


const Page = () => {
  const [sortBy,SetsortBy] = useState<string>('');
  const { data: listings, error, isValidating, isLoading } = useSWR('actions', getListings, {
    refreshInterval: 25 * 60 * 1000,
  });

  if (isValidating || isLoading) {
    return (
      <div className='items-center'>
        <Spinner/>
      </div>
    )
  }

  if (!listings || !Array.isArray(listings)) {
    return (
      <EmptyState showReset />
    );
  }

  const sortedListings = sortBy ? listings.sort((a, b) => {
    if (a.category === sortBy) return -1;
    if (b.category === sortBy) return 1;
    return 0;
  }) : listings;
  

  return (
    <>
      <Container>
        <div className="pb-20 pt-16">
        <Sortcategories Setsort={SetsortBy}/>
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-8">
            {sortedListings.map((listing: any) => {
              return (
                <ListingCard key={listing.id} data={listing} />
              )
            })}
          </div>
        </div>
      </Container>
    </>
  )
}

export default Page
