'use client';
import React, { useCallback, useEffect, useState } from 'react'
import ListingHead from '../../components/ListingCard/ListingHead'
import ListingInfo from '../../components/ListingCard/ListingInfo';
import useLoginModal from '../../hooks/useLoginModal';
import useBookingConfirmModal from '../../hooks/useBookingConfirmModal';
import ListingReservation from '../../components/ListingCard/ListingReservation';
import ConfirmModal from '../../components/Modals/ConfirmModal';
import PrivateDayCruiseSteps from '../../components/Descriptions/PrivateDayCruiseSteps';
import Occupancy from '../../components/Descriptions/Occupancy';
import Updated from '../../components/Hero/Updated';
import Footer from '../../components/Hero/Footer';
import DeluxeFood from '../../components/FoodMenu/DeluxeFood';
import PremiumFood from '../../components/FoodMenu/PremiumFood';
import LuxuryFood from '../../components/FoodMenu/LuxuryFood';
import HouseRules from '../../components/Descriptions/HouseRules';
import CalculatePrice from '@/app/actions/calculatePrice';
import { BoatCruises, BoatCruisesId, BookingType, Categories, coordinates } from '@/app/enums/enums';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { BoatDetails } from './page';
import PrivateDayNightSteps from '../../components/Descriptions/PrivateDayNightSteps';
import PrivateNightStaySteps from '@/app/components/Descriptions/PrivateNightStaySteps';
import useAuth from '@/app/hooks/useAuth';
import SharingDayNightSteps from '@/app/components/Descriptions/SharingDayNightSteps';
import SharingNightStaySteps from '@/app/components/Descriptions/SharingNightStaySteps';
import SharingDayCruiseSteps from '@/app/components/Descriptions/SharingDayCruiseSteps';
import SharingTermsAndConditions from '@/app/components/Descriptions/SharingTermsAndConditions';

export interface ListingClientProps {
  boatDetails: BoatDetails;
  startDate: Date;
  endDate: Date;
  cruiseTypeId: number;
  bookingTypeId: number | null;
}

const ListingClient: React.FC<ListingClientProps> = ({
  boatDetails,
  startDate,
  endDate,
  cruiseTypeId,
  bookingTypeId,
}) => {
  const { user } = useAuth();
  const loginModal = useLoginModal();
  const bookingConfirmModal = useBookingConfirmModal();
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(boatDetails.prices.dayPrice);
  const [finalAdultCount, setFinalAdultCount] = useState(boatDetails.guestCount || 1);
  const [finalChildCount, setFinalChildCount] = useState(0);
  const [isVeg, setIsVeg] = useState(false);
  const [roomCount, setRoomCount] = useState(1);
  const adultAddonPrice = cruiseTypeId === BoatCruisesId.dayCruise ? boatDetails.prices.adultAddOnDayPrice
    : cruiseTypeId === BoatCruisesId.dayNight ? boatDetails.prices.adultAddonDayNightPrice
      : boatDetails.prices.adultAddonNightStayPrice;
  const childAddonPrice = cruiseTypeId === BoatCruisesId.dayCruise ? boatDetails.prices.childAddOnDayPrice
    : cruiseTypeId === BoatCruisesId.dayNight ? boatDetails.prices.childAddonDayNightPrice
      : boatDetails.prices.childAddonNightStayPrice;

  useEffect(() => {
    const isSharing = bookingTypeId === BookingType.sharing;
    const currentMaxAdults = isSharing ? (roomCount * boatDetails.maxAdultCount) : boatDetails.maxAdultCount;
    const currentMaxChildren = isSharing ? (roomCount * boatDetails.maxChildCount) : boatDetails.maxChildCount;

    if (finalAdultCount > currentMaxAdults) {
      setFinalAdultCount(currentMaxAdults);
    }
    if (finalChildCount > currentMaxChildren) {
      setFinalChildCount(currentMaxChildren);
    }
  }, [roomCount, bookingTypeId, boatDetails.maxAdultCount, boatDetails.maxChildCount, finalAdultCount, finalChildCount]);

  useEffect(() => {
    const calculate = async () => {
      try {
        const finalPrice = await CalculatePrice(finalAdultCount, finalChildCount, boatDetails.prices.dayPrice, boatDetails.maxAdultCount, boatDetails.maxChildCount, boatDetails.guestCount, adultAddonPrice, childAddonPrice, roomCount, bookingTypeId)
        setTotalPrice(finalPrice);
      } catch (error) {
        console.error('Error calculating total price:', error);
      }
    }
    calculate();
  }, [finalAdultCount, finalChildCount, roomCount, bookingTypeId, boatDetails, adultAddonPrice, childAddonPrice]);

  const onCreateReservation = useCallback(() => {
    if (user) {
      const isSharing = bookingTypeId === BookingType.sharing;
      const currentMaxAdults = isSharing ? (roomCount * boatDetails.maxAdultCount) : boatDetails.maxAdultCount;
      const currentMaxChildren = isSharing ? (roomCount * boatDetails.maxChildCount) : boatDetails.maxChildCount;

      if (finalAdultCount <= currentMaxAdults && finalChildCount <= currentMaxChildren) {
        return bookingConfirmModal.onOpen();
      } else {
        toast.error("Maximum number of Guests exceeded!!");
      }
    } else {
      return loginModal.onOpen();
    }
  }, [user, bookingConfirmModal, loginModal, finalAdultCount, finalChildCount, roomCount, bookingTypeId, boatDetails.maxAdultCount, boatDetails.maxChildCount])

  const Map = dynamic(() => import('../../components/Misc/Map'), {
    ssr: false
  });


  return (
    <>
      <ConfirmModal boatDetails={boatDetails} modeOfTravel={cruiseTypeId == 1 ? BoatCruises.dayCruise : cruiseTypeId == 2 ? BoatCruises.dayNight : BoatCruises.nightStay} finalPrice={totalPrice} finalHeadCount={finalAdultCount} finalCheckInDate={startDate} finalCheckOutDate={endDate} finalMinorCount={finalChildCount} isVeg={isVeg} bookingTypeId={bookingTypeId} roomCount={roomCount} />
      <div className='max-w-7xl mx-auto pt-4 md:pt-24 pb-18 md:pb-0'>
        <div className='flex flex-col gap-6'>
          <ListingHead
            title={boatDetails.boatCode}
            imageSrc={boatDetails.boatImages || ['/placeholder-boat.jpg']}
            category={boatDetails.boatCategory}
            roomCount={boatDetails.bedroomCount}
            id={boatDetails.boatId} />
          <div className='grid grid-cols-1 md:grid-cols-7 w-11/12 mx-auto md:gap-10 mt-2'>
            <div className="md:col-span-4 flex flex-col gap-6">
              <ListingInfo
                title={boatDetails.boatCode}
                travelMode={cruiseTypeId}
                boardingPoint={boatDetails.boardingPoint}
                category={boatDetails.boatCategory}
                roomCount={boatDetails.bedroomCount}
                bathroomCount={boatDetails.bathroomCount}
                setAdultCount={setFinalAdultCount}
                setChildCount={setFinalChildCount}
                adultCount={finalAdultCount}
                childCount={finalChildCount}
                maxAdultCount={boatDetails.maxAdultCount}
                maxChildCount={boatDetails.maxChildCount}
                minAdultCount={boatDetails.minAdultCount}
                bookingTypeId={bookingTypeId}
                availableRoomCount={boatDetails?.availableRoomCount}
                roomCountState={roomCount}
                setRoomCount={setRoomCount}
              />
              <div className='w-full'>
                {cruiseTypeId === BoatCruisesId.dayNight ? (
                  <>
                    {bookingTypeId == BookingType.sharing ? <SharingTermsAndConditions /> : <Occupancy title={'DayNight Cruise Occupancy'} category={boatDetails.boatCategory} adult={boatDetails.maxAdultCount} child={boatDetails.maxChildCount} Count={boatDetails.guestCount} adultAddonPrice={boatDetails.prices.adultAddonDayNightPrice} childAddonPrice={boatDetails.prices.childAddonDayNightPrice} />}
                    {bookingTypeId !== BookingType.sharing && <hr className='border border-gray-300' />}
                    {bookingTypeId == BookingType.sharing ? <SharingDayNightSteps /> : <PrivateDayNightSteps />}
                  </>
                ) : cruiseTypeId === BoatCruisesId.nightStay ? (
                  <>
                    {bookingTypeId !== BookingType.sharing && <Occupancy title={'Night Stay Occupancy'} category={boatDetails.boatCategory} adult={boatDetails.maxAdultCount} child={boatDetails.maxChildCount} Count={boatDetails.guestCount} adultAddonPrice={boatDetails.prices.adultAddonDayNightPrice} childAddonPrice={boatDetails.prices.childAddonDayNightPrice} />}
                    {bookingTypeId !== BookingType.sharing && <hr className='border border-gray-300' />}
                    {bookingTypeId == BookingType.sharing ? <SharingNightStaySteps /> : <PrivateNightStaySteps />}
                  </>
                ) : (
                  <>
                    {bookingTypeId !== BookingType.sharing && <Occupancy title={'Day Cruise Occupancy'} category={boatDetails.boatCategory} adult={boatDetails.maxAdultCount} child={boatDetails.maxChildCount} Count={boatDetails.guestCount} adultAddonPrice={boatDetails.prices.adultAddOnDayPrice} childAddonPrice={boatDetails.prices.childAddOnDayPrice} />}
                    {bookingTypeId !== BookingType.sharing && <hr className='border border-gray-300' />}
                    {bookingTypeId == BookingType.sharing ? <SharingDayCruiseSteps /> : <PrivateDayCruiseSteps />}
                  </>
                )}
                <div className="hidden md:block">
                  <Map center={coordinates} />
                </div>
                <div className="block md:hidden">
                  <Map center={coordinates} />
                </div>

                {
                  (() => {
                    if (boatDetails.boatCategoryId === Categories.Deluxe) {
                      return (
                        <>
                          <hr className='border border-gray-300' />
                          <DeluxeFood bookingType={cruiseTypeId} />
                        </>
                      )
                    } else if (boatDetails.boatCategoryId === Categories.Premium) {
                      return (
                        <>
                          <hr className='border border-gray-300' />
                          <PremiumFood bookingType={cruiseTypeId} />
                        </>
                      )
                    } else {
                      return (
                        <>
                          <hr className='border border-gray-300' />
                          <LuxuryFood bookingType={cruiseTypeId} />
                        </>
                      )
                    }
                  })()
                }
                <hr className='border border-gray-300' />
                <HouseRules />
              </div>
            </div>
            {!bookingConfirmModal.isOpen&&<div className='md:order-last md:col-span-3'>
              <ListingReservation
                totalPrice={totalPrice}
                cruiseTypeId={cruiseTypeId}
                bookingTypeId={bookingTypeId}
                roomCount={roomCount}
                selectedDate={startDate}
                guestCount={(boatDetails.guestCount) < (finalAdultCount + finalChildCount) ? (finalAdultCount + finalChildCount) : boatDetails.guestCount}
                onSubmit={onCreateReservation}
                disabled={isLoading}
                isVeg={isVeg}
                setIsVeg={setIsVeg}
              />
            </div>}
          </div>
        </div>
      </div>
      <hr className='border border-gray-300' />
      <Updated />
      <Footer />
    </>
  )
}

export default ListingClient