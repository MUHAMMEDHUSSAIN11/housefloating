'use client';

import React from 'react';
import EmptyState from '@/app/components/Misc/EmptyState';
import ListingClient from '../ListingClient';
import getBoatbyId from '@/pages/api/firestore/getBoatbyId'; 
import useSWR from 'swr';


interface Iparams {
  listingid?: string;
}

const Listingpage = async ({ params }: { params: Iparams }) => {

  const fetchedBoatData = await getBoatbyId(params);

  if (!fetchedBoatData) {
    return (
      
        <EmptyState showReset />
     
    );
  } 

  return (
 
      <ListingClient listing={fetchedBoatData} />
   
  );
};

export default Listingpage;
