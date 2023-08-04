'use client';

import { DocumentData, DocumentSnapshot, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore'
import React, { useCallback, useMemo, useState } from 'react'
import ClientOnly from '../components/ClientOnly'
import ListingHead from '../components/ListingCard/ListingHead'
import ListingInfo from '../components/ListingCard/ListingInfo';
import useLoginModal from '../hooks/useLoginModal';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/clientApp';
import useBookingConfirmModal from '../hooks/useBookingConfirmModal';
import ListingReservation from '../components/ListingCard/ListingReservation';
import { User } from 'firebase/auth';


interface ListingClientProps {
  listing: DocumentSnapshot<DocumentData>,
}

const initialDateRange = {
  startDate : new Date (),
  endDate : new Date (),
  key : 'selection'
}

const ListingClient: React.FC<ListingClientProps> = ({ listing }) => {

  const [user] = useAuthState(auth);

  const loginModal = useLoginModal();
  const bookingConfirmModal = useBookingConfirmModal();
  const router = useRouter();
  const disabledDates:Date[] = listing.data()?.reservations
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.data()?.price);
  const [bookingDate, setBookingdate] = useState(initialDateRange);

  const onCreateReservation = useCallback (()=>{
    //need to fix,even if a user is logged in still loginmodal is opened--fixed this by adding dependency user
    //need to update disabled dates..
    if(user){
     return bookingConfirmModal.onOpen();
    }else{
      return loginModal.onOpen();
    }
     
  },[user])


  return (
    <ClientOnly>
      <div className='max-w-screen-lg mx-auto'>
        <div className='flex flex-col gap-6'>
          <ListingHead
            title={listing.data()?.title}
            imageSrc={listing.data()?.imageSrc}
            category={listing.data()?.category}
            roomCount={listing.data()?.roomCount}
            id={listing.id} />
          <div className='grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6'>
            <ListingInfo
              category={listing.data()?.category}
              description={listing.data()?.description}
              roomCount={listing.data()?.roomCount}
              guestCount={listing.data()?.guestCount}
              bathroomCount={listing.data()?.bathroomCount} />
              <div className='order-first mb-10 md:order-last md:col-span-3'>
                <ListingReservation 
                price={listing.data()?.price}
                totalPrice={totalPrice}
                onChangeDate={(value) => setBookingdate(value)}
                onSubmit={onCreateReservation}
                disabled={isLoading}
                disabledDates={disabledDates}
                dateRange={bookingDate}
                />
              </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  )
}

export default ListingClient