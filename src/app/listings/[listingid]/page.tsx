'use client';

import React from 'react';
import EmptyState from '@/app/components/Misc/EmptyState';
import ListingClient from './ListingClient';

import useSWR from 'swr';

import Spinner from '@/app/components/Misc/Spinner';
import getBoatbyId from '@/app/actions/getBoatbyId';

interface Iparams {
  listingid?: string;
}

const fetchBoatData = async (listingId: string ) => {
  const fetchedBoatData = await getBoatbyId({ listingid: listingId });
  return fetchedBoatData;
};

//maybe useParams can be implemented here.

const Listingpage = ({ params }: { params: Iparams }) => {
  const listingId:any = params.listingid;
  const { data: fetchedBoatData,error,isLoading } = useSWR(listingId, () => fetchBoatData(listingId));

  return (
    isLoading ? (
      <div className='pt-28 text-lg'>
        <Spinner/>
      </div>
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
