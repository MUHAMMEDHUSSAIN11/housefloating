'use client';

import React from 'react';
import EmptyState from '@/app/components/Misc/EmptyState';
import ListingClient from './ListingClient';

import useSWR from 'swr';
import getBoatbyId from '@/app/actions/getBoatbyId';

interface Iparams {
  listingid?: string;
}

const fetchBoatData = async (listingId: string ) => {
  const fetchedBoatData = await getBoatbyId({ listingid: listingId });
  return fetchedBoatData;
};

const Listingpage = ({ params }: { params: Iparams }) => {
  const listingId:any = params.listingid;
  const { data: fetchedBoatData,error,isLoading } = useSWR(listingId, () => fetchBoatData(listingId));

  return (
    isLoading ? (
      <div className='pt-28 text-lg'>Loading</div>
    ) : (
      !fetchedBoatData || error ? (
        <EmptyState showReset />
      ) : (
        <ListingClient listing={fetchedBoatData} />
      )
    )
  );

};

export default Listingpage;
