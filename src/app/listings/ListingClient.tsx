'use client';

import { DocumentData, DocumentSnapshot, QueryDocumentSnapshot } from 'firebase/firestore'
import React from 'react'
import ClientOnly from '../components/ClientOnly'
import ListingHead from '../components/ListingCard/ListingHead'




interface ListingClientProps {
    listing : DocumentSnapshot<DocumentData>
}



const ListingClient:React.FC<ListingClientProps> = ({listing}) => {

    
  return (
    <ClientOnly>
    <div className='max-w-screen-lg mx-auto'>
      <div className='flex flex-col gap-6'>
        <ListingHead 
          title={listing.data()?.title} 
          imageSrc={listing.data()?.imageSrc}
          roomCount = {listing.data()?.roomCount}
          id={listing.id} />
      </div>
    </div>
    </ClientOnly>
  )
}

export default ListingClient