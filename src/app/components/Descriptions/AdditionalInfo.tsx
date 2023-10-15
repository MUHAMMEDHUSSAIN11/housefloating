'use client';

import React from 'react';
import { IoCheckmarkCircle, IoFastFoodSharp, IoTrainSharp } from 'react-icons/io5'

const AdditionalInfo = () => {
  return (
    <div className="bg-white p-4 shadow-md rounded-lg font-sans">
      <h2 className="text-xl font-semibold  mb-4">Additional Information</h2>
      <ul className="pl-4 text-md">
        <li className="mb-2 flex items-center">
          <IoCheckmarkCircle className="mr-2 text-blue-500" size={25}/> Confirmation will be received within 2 hours of booking.
        </li>
        <li className="mb-2 flex items-center">
          <IoFastFoodSharp className="mr-2 text-blue-500" size={20} /> Meals Included.
        </li>
        <li className="mb-2 flex items-center">
          <IoTrainSharp className="mr-2 text-blue-500" size={20} /> Near by Public Transport.
        </li>
      </ul>
    </div>
  );
};

export default AdditionalInfo;
