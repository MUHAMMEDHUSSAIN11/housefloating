'use client';

import React from 'react'
import { Hourglass } from 'react-loader-spinner';

const Spinner = () => {
    return (
        <div className='flex items-center justify-center h-screen'>
            <Hourglass visible={true}
                height="60"
                width="60"
                ariaLabel="hourglass-loading"
                wrapperStyle={{}}
                wrapperClass=""
                colors={['#306cce', '#72a1ed']}
            />
        </div>
    )
}

export default Spinner


