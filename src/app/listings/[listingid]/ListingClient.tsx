'use client';
import React, { useCallback, useEffect, useState } from 'react'
import ListingHead from '../../components/ListingCard/ListingHead'
import ListingInfo from '../../components/ListingCard/ListingInfo';
import useLoginModal from '../../hooks/useLoginModal';
import useBookingConfirmModal from '../../hooks/useBookingConfirmModal';
import ListingReservation from '../../components/ListingCard/ListingReservation';
import ConfirmModal from '../../components/Modals/ConfirmModal';
import DayCruiseSteps from '../../components/Descriptions/DayCruiseSteps';
import Occupancy from '../../components/Descriptions/Occupancy';
import Updated from '../../components/Hero/Updated';
import Footer from '../../components/Hero/Footer';
import DeluxeFood from '../../components/FoodMenu/DeluxeFood';
import PremiumFood from '../../components/FoodMenu/PremiumFood';
import LuxuryFood from '../../components/FoodMenu/LuxuryFood';
import HouseRules from '../../components/Descriptions/HouseRules';
import CalculatePrice from '@/app/actions/calculatePrice';
import { BoatCruisesId, Categories, coordinates } from '@/app/enums/enums';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { BoatDetails } from './page';
import OverNightSteps from '../../components/Descriptions/OverNightSteps';
import NightStaySteps from '@/app/components/Descriptions/NightStaySteps';
import useAuth from '@/app/hooks/useAuth';

export interface ListingClientProps {
  boatDetails: BoatDetails;
  date: Date;
  cruiseTypeId: number;
}

const ListingClient: React.FC<ListingClientProps> = ({
  boatDetails,
  date,
  cruiseTypeId,
}) => {
  const { user } = useAuth();
  const loginModal = useLoginModal();
  const bookingConfirmModal = useBookingConfirmModal();
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(boatDetails.prices.dayPrice);
  const [finalAdultCount, setFinalAdultCount] = useState(boatDetails.guestCount);
  const [finalChildCount, setFinalChildCount] = useState(0);
  const adultAddonPrice = cruiseTypeId === BoatCruisesId.dayCruise ? boatDetails.prices.adultAddOnDayPrice
    : cruiseTypeId === BoatCruisesId.overNightCruise ? boatDetails.prices.adultAddonDayNightPrice
      : boatDetails.prices.adultAddonNightStayPrice;
  const childAddonPrice = cruiseTypeId === BoatCruisesId.dayCruise ? boatDetails.prices.childAddOnDayPrice
    : cruiseTypeId === BoatCruisesId.overNightCruise ? boatDetails.prices.childAddonDayNightPrice
      : boatDetails.prices.childAddonNightStayPrice;

  useEffect(() => {
    const calculate = async () => {
      try {
        const finalPrice = await CalculatePrice(finalAdultCount, finalChildCount, boatDetails.prices.dayPrice, boatDetails.maxAdulCount, boatDetails.maxChildCount, boatDetails.guestCount, adultAddonPrice, childAddonPrice)
        setTotalPrice(finalPrice);
      } catch (error) {
        console.error('Error calculating total price:', error);
      }
    }
    calculate();
  }, [finalAdultCount, finalChildCount]);

  const onCreateReservation = useCallback(() => {
    if (user) {
      if (finalAdultCount <= boatDetails.maxAdulCount) {
        return bookingConfirmModal.onOpen();
      } else {
        toast.error("Maximum number of Guests exceeded!!")
      }
    } else {
      return loginModal.onOpen();
    }
  }, [user, bookingConfirmModal, loginModal, finalAdultCount])

  const Map = dynamic(() => import('../../components/Misc/Map'), {
    ssr: false
  });


  return (
    <>
      <ConfirmModal boatDetails={boatDetails} modeOfTravel={cruiseTypeId == 1 ? 'Day Cruise' : cruiseTypeId == 2 ? 'Overnight Cruise' : 'Night Stay'} finalPrice={totalPrice} finalHeadCount={finalAdultCount} finalBookingDate={date} finalMinorCount={finalChildCount} />
      <div className='max-w-screen-xl mx-auto pt-20 md:pt-24 pb-24 md:pb-0'>
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
                guestCount={boatDetails.guestCount}
                bathroomCount={boatDetails.bathroomCount}
                setAdultCount={setFinalAdultCount}
                setChildCount={setFinalChildCount}
                adultCount={finalAdultCount}
                childCount={finalChildCount}
                maxAdultCount={boatDetails.maxAdulCount}
                maxchildCount={boatDetails.maxChildCount}
                minAdultCount={boatDetails.minAdulCount}
              />
              <div className='w-full'>
                {cruiseTypeId === BoatCruisesId.overNightCruise ? (
                  <>
                    <Occupancy title={'Overnight Cruise Occupancy'} category={boatDetails.boatCategory} adult={boatDetails.maxAdulCount} child={boatDetails.maxChildCount} Count={boatDetails.guestCount} adultAddonPrice={boatDetails.prices.adultAddonDayNightPrice} childAddonPrice={boatDetails.prices.childAddonDayNightPrice} />
                    <hr />
                    <OverNightSteps />
                  </>
                ) : cruiseTypeId === BoatCruisesId.nightStay ? (
                  <>
                    <Occupancy title={'Night Stay Occupancy'} category={boatDetails.boatCategory} adult={boatDetails.maxAdulCount} child={boatDetails.maxChildCount} Count={boatDetails.guestCount} adultAddonPrice={boatDetails.prices.adultAddonDayNightPrice} childAddonPrice={boatDetails.prices.childAddonDayNightPrice} />
                    <hr />
                    <NightStaySteps />
                  </>
                ) : (
                  <>
                    <Occupancy title={'Day Cruise Occupancy'} category={boatDetails.boatCategory} adult={boatDetails.maxAdulCount} child={boatDetails.maxChildCount} Count={boatDetails.guestCount} adultAddonPrice={boatDetails.prices.adultAddOnDayPrice} childAddonPrice={boatDetails.prices.childAddOnDayPrice} />
                    <hr />
                    <DayCruiseSteps />
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
                          <hr />
                          <DeluxeFood bookingType={cruiseTypeId} />
                        </>
                      )
                    } else if (boatDetails.boatCategoryId === Categories.Premium) {
                      return (
                        <>
                          <hr />
                          <PremiumFood bookingType={cruiseTypeId} />
                        </>
                      )
                    } else {
                      return (
                        <>
                          <hr />
                          <LuxuryFood bookingType={cruiseTypeId} />
                        </>
                      )
                    }
                  })()
                }
                <hr />
                <HouseRules />
              </div>
            </div>
            <div className='md:order-last md:col-span-3'>
              <ListingReservation
                totalPrice={totalPrice}
                cruiseTypeId={cruiseTypeId}
                onSubmit={onCreateReservation}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
      <hr />
      <Updated />
      <Footer />
    </>
  )
}

export default ListingClient