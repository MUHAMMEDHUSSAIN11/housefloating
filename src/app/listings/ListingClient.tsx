'use client';

import { DocumentData, DocumentSnapshot, Timestamp } from 'firebase/firestore'
import React, { useCallback, useEffect, useState } from 'react'
import ListingHead from '../components/ListingCard/ListingHead'
import ListingInfo from '../components/ListingCard/ListingInfo';
import useLoginModal from '../hooks/useLoginModal';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/clientApp';
import useBookingConfirmModal from '../hooks/useBookingConfirmModal';
import ListingReservation from '../components/ListingCard/ListingReservation';
import ConfirmModal from '../components/Modals/ConfirmModal';
import useTravelModeStore from '../hooks/useTravelModeStore';
import DayCruiseSteps from '../components/Descriptions/DayCruiseSteps';
import NightSteps from '../components/Descriptions/NightSteps';
import Occupancy from '../components/Descriptions/Occupancy';
import Updated from '../components/Hero/Updated';
import Footer from '../components/Hero/Footer';
import DeluxeFood from '../components/FoodMenu/DeluxeFood';
import PremiumFood from '../components/FoodMenu/PremiumFood';
import LuxuryFood from '../components/FoodMenu/LuxuryFood';
import HouseRules from '../components/Descriptions/HouseRules';




interface ListingClientProps {
  listing : { reservedDates: Date[], getboat: DocumentSnapshot<DocumentData> }
}


const ListingClient: React.FC<ListingClientProps> = ({ listing }) => {

  const [user] = useAuthState(auth);
  const loginModal = useLoginModal();
  const bookingConfirmModal = useBookingConfirmModal();
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.getboat.data()?.price);
  const [finalAdultCount, setFinalAdultCount] = useState(listing.getboat.data()?.guestCount);
  const [finalChildCount, setFinalChildCount] = useState(0);
  const [bookingDate, setBookingdate] = useState<Date>(new Date);
  const cruiseType = useTravelModeStore();
  // const date = useBookingDateStore();

  const adultPrice = 500;
  const childPrice = 250;
  const weekendPrice = 1000;
  let newTotalPrice;

  useEffect(() => {
    // Calculate the additional cost for adults and children
    const additionalAdultCost = (finalAdultCount - (listing.getboat.data()?.guestCount || 0)) * adultPrice;
    const additionalChildCost = finalChildCount * childPrice;
    const bookingDay = bookingDate.getDay();
    if (bookingDay === 6 || bookingDay === 0) {
      newTotalPrice = (listing.getboat.data()?.price || 0) + additionalAdultCost + additionalChildCost + weekendPrice;
    }
    else {
      newTotalPrice = (listing.getboat.data()?.price || 0) + additionalAdultCost + additionalChildCost;
    }

    // Format the total price using toLocaleString to add commas and currency symbol if needed
    const formattedTotalPrice = newTotalPrice.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
    });

    setTotalPrice(formattedTotalPrice);
  }, [finalAdultCount, finalChildCount, bookingDate]);


  const onCreateReservation = useCallback(() => {
    //need to check if final guest count should be less than maximum for mode of travel
    if (user) {
      return bookingConfirmModal.onOpen();
    } else {
      return loginModal.onOpen();
    }

  }, [user, bookingConfirmModal, loginModal])



  return (
    <>
      <ConfirmModal listing={listing} modeOfTravel={cruiseType.travelMode} finalPrice={totalPrice} finalHeadCount={finalAdultCount} finalBookingDate={bookingDate} finalMinorCount={finalChildCount} />
      <div className='max-w-screen-lg mx-auto pt-28'>
        <div className='flex flex-col gap-6'>
          <ListingHead
            title={listing.getboat.data()?.title}
            imageSrc={listing.getboat.data()?.images}
            category={listing.getboat.data()?.category}
            roomCount={listing.getboat.data()?.roomCount}
            id={listing.getboat.id} />
          <div className='grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6'>
            <ListingInfo
              travelMode={cruiseType.travelMode}
              category={listing.getboat.data()?.category}
              description={listing.getboat.data()?.description}
              roomCount={listing.getboat.data()?.roomCount}
              guestCount={listing.getboat.data()?.guestCount}
              bathroomCount={listing.getboat.data()?.bathroomCount}
              setAdultCount={setFinalAdultCount}
              setChildCount={setFinalChildCount}
              adultCount={finalAdultCount}
              childCount={finalChildCount}
              dayGuestCountMax={listing.getboat.data()?.maxDayGuest}
              nightGuestCountMax={listing.getboat.data()?.maxNightGuest}
            />
            <div className=' mb-10 md:order-last md:col-span-3'>
              <ListingReservation
                price={listing.getboat.data()?.price}
                totalPrice={totalPrice}
                onChangeDate={(value) => setBookingdate(value)}
                onSubmit={onCreateReservation}
                disabled={isLoading}
                disabledDates={listing.reservedDates}
                date={bookingDate}
              />
            </div>
          </div>
          {cruiseType.travelMode === "Overnight" ? (
            <>
              <Occupancy title={'Overnight Cruise Occupancy'} category={listing.getboat.data()?.category} limit={listing.getboat.data()?.maxNightGuest} Count={listing.getboat.data()?.guestCount} />
              <hr />
              <NightSteps />
            </>
          ) : (
            <>
              <Occupancy title={'Day Cruise Occupancy'} category={listing.getboat.data()?.category} limit={listing.getboat.data()?.maxDayGuest} Count={listing.getboat.data()?.guestCount} />
              <hr />
              <DayCruiseSteps />
            </>
          )}
          {
            (() => {
              if (listing.getboat.data()?.category === "Deluxe Houseboats") {
                return (
                  <>
                    <hr />
                    <DeluxeFood />
                  </>
                )
              } else if (listing.getboat.data()?.category === "Premium Houseboats") {
                return (
                  <>
                    <hr />
                    <PremiumFood />
                  </>
                )
              } else {
                return (
                  <>
                    <hr />
                    <LuxuryFood />
                  </>
                )
              }
            })()
          }
          <hr />
          <HouseRules />
        </div>
      </div>
      <hr />
      <Updated />
      <Footer />
      </>
  )
}

export default ListingClient