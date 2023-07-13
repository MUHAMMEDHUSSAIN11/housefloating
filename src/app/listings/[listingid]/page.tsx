import getBoatbyId from '@/app/actions/getBoatbyId';
import React from 'react'

interface Iparams{
    listingid?: string;
}

const Listingpage = async ({ params }: { params: Iparams }) => {
  try {
    const boat = await getBoatbyId(params);
    
    if (boat && boat.exists()) {
      const title = boat.data().title;
      return (
        <div className='pt-28'>
          <h1>{title}</h1>
        </div>
      );
    }
  } catch (error) {
    console.log(error);
  }
  return (
    <div> doesnot exists </div>
  );
};

export default Listingpage