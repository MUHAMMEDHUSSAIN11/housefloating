'use client';

import React from 'react';

const AdditionalInfo = () => {

  return (
    <div className="bg-white p-4 shadow-md rounded-lg">
      <h2 className="text-xl font-semibold font-sans mb-4">Additional Information</h2>
      <ul className='pl-4'>
          <li className=" mb-2 list-disc">
          Confirmation will be received within 2 hours of booking, subject to availability
          </li>
          <li className=" mb-2 list-disc">Meals Included</li>
          <li className=" mb-2 list-disc">Near by Public Transport</li>
      </ul>
    </div>
  );
};

export default AdditionalInfo;
