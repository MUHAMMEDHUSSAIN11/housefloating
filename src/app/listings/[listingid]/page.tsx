'use client';
import getBoatbyId from '@/app/actions/getBoatbyId';
import ClientOnly from '@/app/components/ClientOnly';
import EmptyState from '@/app/components/Misc/EmptyState';
import React from 'react'
import ListingClient from '../ListingClient';
import ConfirmModal from '@/app/components/Modals/ConfirmModal';



interface Iparams {
  listingid?: string;
}


const Listingpage = async  ({ params }: { params: Iparams }) => {

   //This call increase firestore usage..need to call firestore directly here 
  const Boat = await getBoatbyId(params);

    if (!Boat) {
      return (
        <ClientOnly>
          <EmptyState />
        </ClientOnly>
      )
    }
    
    return (
      <ClientOnly>
        <ListingClient listing={Boat} />
        <ConfirmModal listing={Boat}/>
      </ClientOnly>
    );

};

export default Listingpage