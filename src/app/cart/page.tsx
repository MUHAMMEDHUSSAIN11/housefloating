'use client';

import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase/clientApp';

const Cart = () => {
  const [user] = useAuthState(auth);
  if(user){
    return (
      <div className='pt-28'>
      {user.email}
      </div>
    )
  }

  return(
    <div className='pt-28'> Please login to see your cart</div>
  )
}

export default Cart