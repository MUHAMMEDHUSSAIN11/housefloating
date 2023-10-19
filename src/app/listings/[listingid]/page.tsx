'use client';

import React from 'react';
import EmptyState from '@/app/components/Misc/EmptyState';
import ListingClient from './ListingClient';

import useSWR from 'swr';
import getBoatbyId from '@/app/actions/getBoatbyId';

interface Iparams {
  listingid?: string;
}

const fetchBoatData = async (listingId: string | undefined) => {
  const fetchedBoatData = await getBoatbyId({ listingid: listingId });
  return fetchedBoatData;
};

const Listingpage = ({ params }: { params: Iparams }) => {
  const listingId = params.listingid;
  const { data: fetchedBoatData,error,isLoading } = useSWR(listingId, () => fetchBoatData(listingId));

  if(isLoading){
    return(
      <>
      <div className='pt-28 text-lg'>Loading</div>
      </>
    )
  }

  if (!fetchedBoatData || error) {
    return (
      <EmptyState showReset />
    );
  } 

  return (
    <ListingClient listing={fetchedBoatData} />
  );
};

export default Listingpage;
