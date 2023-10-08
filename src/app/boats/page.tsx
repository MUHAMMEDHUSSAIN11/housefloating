'use client';

import React from 'react'
import Container from '../components/Misc/Container';
import ListingCard from '../components/ListingCard/ListingCard';
import EmptyState from '../components/Misc/EmptyState';
import useSWR from 'swr';
import getListings from '@/pages/api/firestore/getListings';
import Footer from '../components/Hero/Footer';


const page = () => {
    const { data: listings, error, isValidating, isLoading } = useSWR('api/firestore', getListings, {
      refreshInterval: 25 * 60 * 1000, 
    });

  if (isValidating || isLoading) {
    return (
      <div>
        {/*need to add Loading Component here */}
        <p>Loading...</p>
      </div>
    )
  }

  if (listings == null) {
    return (
    
        <EmptyState showReset />
     
    )
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

export default page
