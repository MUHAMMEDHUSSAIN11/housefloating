'use client';

import { DocumentData, DocumentSnapshot } from 'firebase/firestore'
import React, { useCallback, useEffect, useState } from 'react'
import ListingHead from '../../components/ListingCard/ListingHead'
import ListingInfo from '../../components/ListingCard/ListingInfo';
import useLoginModal from '../../hooks/useLoginModal';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/clientApp';
import useBookingConfirmModal from '../../hooks/useBookingConfirmModal';
import ListingReservation from '../../components/ListingCard/ListingReservation';
import ConfirmModal from '../../components/Modals/ConfirmModal';
import useTravelModeStore from '../../hooks/useTravelModeStore';
import DayCruiseSteps from '../../components/Descriptions/DayCruiseSteps';
import NightSteps from '../../components/Descriptions/NightSteps';
import Occupancy from '../../components/Descriptions/Occupancy';
import Updated from '../../components/Hero/Updated';
import Footer from '../../components/Hero/Footer';
import DeluxeFood from '../../components/FoodMenu/DeluxeFood';
import PremiumFood from '../../components/FoodMenu/PremiumFood';
import LuxuryFood from '../../components/FoodMenu/LuxuryFood';
import HouseRules from '../../components/Descriptions/HouseRules';
import CalculatePrice from '@/app/actions/calculatePrice';
import { Categories, coordinates, TravelMode } from '@/app/enums/enums';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';


export interface ListingClientProps {
  listing: { reservedDates: Date[], getboat: DocumentSnapshot<DocumentData> }
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


  useEffect(() => {
    CalculatePrice(finalAdultCount, finalChildCount, bookingDate, listing, cruiseType.travelMode)
      .then((totalPrice) => {
        setTotalPrice(totalPrice);
      })
      .catch((error) => {
        console.error('Error calculating total price:', error);
      });
  }, [finalAdultCount, finalChildCount, bookingDate, cruiseType]);



  const onCreateReservation = useCallback(() => {
    if (user) {
      if (cruiseType.travelMode == TravelMode.DayCruise && finalAdultCount <= listing.getboat.data()?.maxDayGuest) {
        return bookingConfirmModal.onOpen();
      } else if (cruiseType.travelMode == TravelMode.OverNight && finalAdultCount <= listing.getboat.data()?.maxNightGuest) {
        return bookingConfirmModal.onOpen();
      } else {
        toast.error("Maximum number of Guests exceeded!!")
      }

    } else {
      return loginModal.onOpen();
    }
  }, [user, bookingConfirmModal, loginModal, cruiseType, finalAdultCount])

  const Map = dynamic(() => import('../../components/Misc/Map'), {
    ssr: false
  });


  return (
    <>
      <ConfirmModal listing={listing} modeOfTravel={cruiseType.travelMode} finalPrice={totalPrice} finalHeadCount={finalAdultCount} finalBookingDate={bookingDate} finalMinorCount={finalChildCount} />
      <div className='max-w-screen-lg mx-auto pt-40 md:pt-20'>
        <div className='flex flex-col gap-6'>
          <ListingHead
            title={listing.getboat.data()?.guestTitle}
            imageSrc={listing.getboat.data()?.images}
            category={listing.getboat.data()?.category}
            roomCount={listing.getboat.data()?.roomCount}
            id={listing.getboat.id} />
          <div className='grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6'>
            <ListingInfo
              title={listing.getboat.data()?.guestTitle}
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
                setAdultCount={setFinalAdultCount}
                setChildCount={setFinalChildCount}
                disabled={isLoading}
                disabledDates={listing.reservedDates}
                date={bookingDate}
                guestCount={listing.getboat.data()?.guestCount}
              />
            </div>
          </div>
          <div className="block md:hidden">
            <Map center={coordinates} />

          </div>
          {cruiseType.travelMode === "Overnight" ? (
            <>
              <Occupancy title={'Overnight Cruise Occupancy'} category={listing.getboat.data()?.category} limit={listing.getboat.data()?.maxNightGuest} Count={listing.getboat.data()?.guestCount} adultAddonPrice={listing.getboat.data()?.adultAddonPrice} childAddonPrice={listing.getboat.data()?.childAddonPrice} />
              <hr />
              <NightSteps />
            </>
          ) : (
            <>
              <Occupancy title={'Day Cruise Occupancy'} category={listing.getboat.data()?.category} limit={listing.getboat.data()?.maxDayGuest} Count={listing.getboat.data()?.guestCount} adultAddonPrice={listing.getboat.data()?.adultAddonPrice} childAddonPrice={listing.getboat.data()?.childAddonPrice} />
              <hr />
              <DayCruiseSteps />
            </>
          )}
          {
            (() => {
              if (listing.getboat.data()?.category === Categories.Deluxe) {
                return (
                  <>
                    <hr />
                    <DeluxeFood bookingType={cruiseType.travelMode} />
                  </>
                )
              } else if (listing.getboat.data()?.category === Categories.Premium) {
                return (
                  <>
                    <hr />
                    <PremiumFood bookingType={cruiseType.travelMode} />
                  </>
                )
              } else {
                return (
                  <>
                    <hr />
                    <LuxuryFood bookingType={cruiseType.travelMode} />
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