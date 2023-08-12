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
import useBookingDateStore from '../hooks/useBookingDate';


interface ListingClientProps {
  listing: { reservedDates: Date[], getboat: DocumentSnapshot<DocumentData> }
}


const ListingClient: React.FC<ListingClientProps> = ({ listing }) => {

  const [user] = useAuthState(auth);
  const loginModal = useLoginModal();
  const bookingConfirmModal = useBookingConfirmModal();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.getboat.data()?.price);
  // const [bookingDate, setBookingdate] = useState<Date>(new Date);
  const date = useBookingDateStore();


  const onCreateReservation = useCallback(() => {
    if (user) {
      return bookingConfirmModal.onOpen();
    } else {
      return loginModal.onOpen();
    }

  }, [user, bookingConfirmModal, loginModal, date.bookingDate])


  return (
    <ClientOnly>
      <div className='max-w-screen-lg mx-auto'>
        <div className='flex flex-col gap-6'>
          <ListingHead
            title={listing.getboat.data()?.title}
            imageSrc={listing.getboat.data()?.imageSrc}
            category={listing.getboat.data()?.category}
            roomCount={listing.getboat.data()?.roomCount}
            id={listing.getboat.id} />
          <div className='grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6'>
            <ListingInfo
              category={listing.getboat.data()?.category}
              description={listing.getboat.data()?.description}
              roomCount={listing.getboat.data()?.roomCount}
              guestCount={listing.getboat.data()?.guestCount}
              bathroomCount={listing.getboat.data()?.bathroomCount} />
            <div className='order-first mb-10 md:order-last md:col-span-3'>
              <ListingReservation
                price={listing.getboat.data()?.price}
                totalPrice={totalPrice}
                onChangeDate={(value) => date.setBookingDate(value)}
                onSubmit={onCreateReservation}
                disabled={isLoading}
                disabledDates={listing.reservedDates}
                date={date.bookingDate}
              />
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  )
}

export default ListingClient