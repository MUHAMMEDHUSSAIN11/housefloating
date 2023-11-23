'use client';

import React from 'react'
import { Toaster} from 'sonner'

const SonnerToastProvider = () => {
  return (
    <>
    <Toaster position="top-center" richColors />
    </>
  )
}

export default SonnerToastProvider