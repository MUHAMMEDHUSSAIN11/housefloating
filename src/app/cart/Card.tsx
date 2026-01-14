'use client';

import React, { useCallback } from 'react';
import Image from 'next/image';
import Button from '../components/Misc/Button';
import { IoBoat, IoCalendarNumberSharp, IoCheckmarkCircle, IoPersonSharp, IoTime } from 'react-icons/io5';
import { BookingStatuses } from '../enums/enums';
import CheckIsDateOver from '../actions/checkDateOver';
import Link from 'next/link';
import { BookingData } from './page';
import { Baby, House } from 'lucide-react';

interface CardListingProps {
  details: BookingData;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string; 
}

const Card: React.FC<CardListingProps> = ({ details, onAction, disabled, actionId = '', actionLabel }) => {

  function formatDate(date: any) {
    const options = { day: "numeric", month: "short", year: "numeric" }
    return date.toLocaleDateString(undefined, options)
  }

  const bookingDateObj = new Date(details.tripDate);
  const IsDateOver = CheckIsDateOver(bookingDateObj);

  const handleCancel: any = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (disabled) {
      return;
    }
    onAction?.(actionId)
  }, [disabled, onAction, actionId]);

  // Status styling helper
  const getStatusStyle = (status: number) => {
    switch (status) {
      case BookingStatuses.Booked:
        return "bg-green-100 text-green-800 border-green-200";
      case BookingStatuses.Cancelled:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className='bg-white shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100'>
      <div className="flex flex-col lg:flex-row">
        {/* Image Section */}
        <Link href={`/listings/${details.boatId}`} className="relative lg:w-2/5 h-64 lg:h-auto overflow-hidden cursor-pointer group block">
          <Image
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            src={details.imageUrl}
            alt="Listing"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(details.bookingStatusId)}`}>
              {details.bookingStatus}
            </span>
          </div>
        </Link>

        {/* Content Section */}
        <div className='flex flex-col lg:flex-row lg:w-4/5'>
          {/* Details Section */}
          <div className='flex-1 p-6 space-y-4'>
            {/* Title */}
            <div className="mb-4">
              <h3 className='text-xl font-bold text-gray-900 mb-1'>
                {details.boatName}
              </h3>
              <p className='text-sm text-gray-600 font-medium'>
                {details.boatCategoryName} Houseboat
              </p>
            </div>

            {/* Info Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              <div className='flex items-center gap-3 p-3 bg-blue-50 rounded-lg'>
                <div className="shrink-0">
                  <IoCalendarNumberSharp className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Trip Date</p>
                  <p className="font-semibold text-gray-900">{formatDate(new Date(details.tripDate))}</p>
                </div>
              </div>

              <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                <div className="shrink-0">
                  {'Confirmed' == "Confirmed" ? (
                    <IoCheckmarkCircle className="text-green-600" size={20} />
                  ) : (
                    <IoTime className="text-orange-500" size={20} />
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Status</p>
                  <p className="font-semibold text-gray-900">{details.bookingStatus}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 lg:gap-3 p-1 lg:p-3 bg-green-50 rounded-lg">
                <div>
                    <p className="text-xs text-gray-600 uppercase tracking-wide">Adult</p>
                    <div className="flex gap-1">
                        <IoPersonSharp className="text-green-600" size={20} />
                        <p className="font-semibold text-sm text-gray-900">{details.adultCount}</p>
                    </div>
                </div>
                <div>
                    <p className="text-xs text-gray-600 uppercase tracking-wide">Child</p>
                    <div className="flex gap-1">
                        <Baby className="text-green-600" size={20} />
                        <p className="font-semibold text-sm text-gray-900">{details.childCount}</p>
                    </div>
                </div>
                <div className={`${!details.isSharing&&'hidden'}`}>
                    <p className="text-xs text-gray-600 uppercase tracking-wide">Room</p>
                    <div className="flex gap-1">
                        <House className="text-green-600" size={20} />
                        <p className="font-semibold text-sm text-gray-900">{details.roomCount}</p>
                    </div>
                </div>
              </div>

              <div className='flex items-center gap-3 p-3 bg-purple-50 rounded-lg'>
                <div className="shrink-0">
                  <IoBoat className='text-purple-600' size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Cruise</p>
                  <p className="font-semibold text-gray-900">{details.cruiseType}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className='lg:w-80 bg-gray-50 p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-200'>
            <div className='space-y-4'>
              <h4 className='text-lg font-bold text-gray-900 mb-4'>Pricing Details</h4>

              {/* Pricing Breakdown */}
              <div className='space-y-3'>
                <div className='flex justify-between items-center p-3 bg-white rounded-lg shadow-sm'>
                  <span className='text-gray-700 font-medium'>Total Price</span>
                  <span className='text-xl font-bold text-gray-900'>₹{details.price}</span>
                </div>

                <div className='flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200'>
                  <span className='text-blue-700 font-medium'>Advance Payment</span>
                  <span className='text-lg font-bold text-blue-900'>₹{details.advanceAmount || 0}</span>
                </div>

                <div className='p-3 bg-yellow-50 rounded-lg border border-yellow-200'>
                  <div className='flex justify-between items-center mb-1'>
                    <span className='text-yellow-700 font-medium'>Remaining Amount</span>
                    <span className='text-lg font-bold text-yellow-900'>₹{details.price - details.advanceAmount}</span>
                  </div>
                  <p className='text-xs text-yellow-600'>To be paid at check-in</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='space-y-3 mt-6 pb-9 md:pb-0'>
              {onAction && actionLabel && (
                <Button
                  disabled={details.bookingStatusId === BookingStatuses.Cancelled || !IsDateOver}
                  outline
                  small
                  label={actionLabel}
                  onClick={handleCancel}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card