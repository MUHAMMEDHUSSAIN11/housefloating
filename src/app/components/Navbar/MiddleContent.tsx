'use client';

import * as NProgress from "nprogress";
import React from 'react'
import { BiSearch } from 'react-icons/bi';
import { useRouter } from 'next/navigation';

const MiddleContent = () => {

    const handlePush = () => {
        router.push("/boats");
        NProgress.start();
        NProgress.done();
    };

    const router = useRouter();
    return (
        <div onClick={() => handlePush()} className=" font-sans bg-white border-[1px] w-full md:w-auto py-2 rounded-full shadow-sm hover:shadow-md transition cursor-pointer">
            <div className="flex flex-row items-center justify-between">
                <div className="hidden sm:block text-md  px-6">Deluxe Houseboats</div>
                <div className="text-md px-6 sm:hidden">Start your search</div>
                <div className="hidden sm:block text-md px-6 border-x-[1px] flex-11 text-center">Premium Houseboats</div>
                <div className="text-md pl-6 pr-2  flex flex-row items-center gap-3">
                    <div className="hidden sm:block ">Luxury Houseboats</div>
                    <div className="p-2 bg-blue-500 rounded-full text-white">
                        <BiSearch size={18} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MiddleContent