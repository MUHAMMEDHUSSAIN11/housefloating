'use client';

import React from 'react'
import Container from '../components/Misc/Container';
import ListingCard from '../components/ListingCard/ListingCard';
import EmptyState from '../components/Misc/EmptyState';
import useSWR from 'swr';
import getListings from '../actions/getListings';
import Spinner from '../components/Misc/Spinner';


const Page = () => {
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

  return (
    <>
      <Container>
        <div className="pb-20 pt-16">
          <div className="pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-8">
            {listings.map((listing: any) => {
              return (
                <ListingCard key={listing.id} data={listing} />
              )
            })}
          </div>
        </div>
      </Container>
      {/* <hr/>
      <Footer/> */}
    </>
  )
}

export default Page
