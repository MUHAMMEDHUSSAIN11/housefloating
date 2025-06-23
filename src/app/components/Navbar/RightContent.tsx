'use client';

import React, { useCallback, useEffect, useState } from 'react'
import { AiOutlineMenu } from "react-icons/ai";
import Avatar from '../Avatar/Avatar';
import useLoginModal from '@/app/hooks/useLoginModal';
import useRegisterModal from '@/app/hooks/useRegisterModal';
import UserMenuItem from './UserMenuItem';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/clientApp';
import { useSignOut } from 'react-firebase-hooks/auth';
import useRentModal from '@/app/hooks/useRentModal';
import { useRouter } from 'next/navigation';
import * as NProgress from 'nprogress';
import isAuthority from '@/app/actions/checkAuthority';



const RightContent = () => {
    const loginModal = useLoginModal();
    const registerModal = useRegisterModal();
    const rentModal = useRentModal();
    const [isOpen, setIsOpen] = useState(false);
    const [user, loading, error] = useAuthState(auth);
    const [signOut, signOutloading, Signerror] = useSignOut(auth);
    const router = useRouter();


    const handlePush = () => {
        router.push('/cart');
        NProgress.start();
        NProgress.done();
    };


    const handleLogout = () => {
        signOut();
    };

    const toggleOpen = useCallback(() => {
        setIsOpen((value) => !value);
    }, []);

    useEffect(() => {
        setIsOpen(false);
    }, []);

    const onRent = useCallback(() => {
        //open rent modal
        rentModal.onOpen();
    }, [rentModal])

    return (
        <div className="relative">
            <div className="flex flex-row items-center gap-4 ">
                {/* <div className="p-2 cursor-pointer hover:shadow-md transition rounded-full" onClick={()=>handlePush()}>
                    <GiSailboat size={33} />
                </div> */}
                <div onClick={toggleOpen} className="p-3 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition">
                    <AiOutlineMenu />
                    <div className="hidden md:block gap-2">
                        <Avatar />
                    </div>
                </div>
            </div>
            {isOpen &&
                // <div className="absolute rounded-xl shadow-md w-[40vw] md:w-5/6 bg-white overflow-hidden right-0 top-12 text-sm">
               <div className="absolute rounded-xl shadow-md w-[40vw] md:w-48 bg-white overflow-hidden right-0 top-12 text-sm z-[60]">
               {/* <div className="absolute rounded-xl shadow-md w-[40vw] md:w-40 bg-white overflow-hidden right-0 top-12 text-sm min-w-[180px]"> */}
                    <div className="flex flex-col cursor-pointer">
                        {user && (
                            <>
                                <UserMenuItem onClick={handleLogout} label="Logout" />
                                <hr />
                                <div className="sm:block md:hidden px-4 py-3 hover:bg-neutral-100 transition">Contact Us</div>
                            </>
                        )}
                        {!user && (
                            <>
                                <UserMenuItem onClick={loginModal.onOpen} label="Login" />
                                <UserMenuItem onClick={registerModal.onOpen} label="Sign Up" />
                                <div className="sm:block md:hidden px-4 py-3 hover:bg-neutral-100 transition ">Contact Us</div>
                            </>
                        )}
                        {user && isAuthority(user.uid) && (
                            <>
                                <UserMenuItem onClick={() => router.push('/admin')} label="Reservations" />
                                <hr />
                                <UserMenuItem onClick={onRent} label="Add Listing" />
                            </>
                        )}
                    </div>
                </div>
            }
        </div>
    );

};

export default RightContent