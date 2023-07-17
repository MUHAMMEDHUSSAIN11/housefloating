'use client';

import getBoatbyId from '@/app/actions/getBoatbyId';
import ClientOnly from '@/app/components/ClientOnly';
import EmptyState from '@/app/components/Misc/EmptyState';
import React from 'react'
import ListingClient from '../ListingClient';


interface Iparams {
  listingid?: string;
}

const Listingpage = async ({ params }: { params: Iparams }) => {
  try {
    const boat = await getBoatbyId(params);
    if (!boat) {
      return (
        <ClientOnly>
          <EmptyState />
        </ClientOnly>
      )
    }
      return (
            <ClientOnly>
              <ListingClient listing={boat} />
          </ClientOnly>
      );
  } catch (error) {
    console.log(error);
  }

};

export default Listingpage