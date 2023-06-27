'use client';
import React, { useCallback, useEffect, useState } from 'react'
import { AiOutlineMenu } from "react-icons/ai";
import { GiSailboat } from 'react-icons/gi';
import { BsFillTelephoneFill } from 'react-icons/bs'
import Avatar from '../Avatar/Avatar';
import useLoginModal from '@/app/hooks/useLoginModal';
import useRegisterModal from '@/app/hooks/useRegisterModal';
import UserMenuItem from './UserMenuItem';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/clientApp';
import { signOut } from 'firebase/auth';





const RightContent = () => {
    const loginModal = useLoginModal();
    const registerModal = useRegisterModal();
    const [isOpen, setIsOpen] = useState(false);
    const [user, loading, error] = useAuthState(auth);


    const handleLogout = () => {
        signOut(auth)
    };

    const toggleOpen = useCallback(() => {
        setIsOpen((value) => !value);
    }, []);

    useEffect(() => {
        setIsOpen(false);
    }, []);

    return (
        <div className="relative">
            <div className="flex flex-row items-center gap-4 ">
                <div className="p-2 cursor-pointer hover:shadow-md transition rounded-full">
                    <GiSailboat size={33} />
                </div>
                <div className=" hidden md:block p-2 cursor-pointer hover:shadow-md transition rounded-full">
                    <BsFillTelephoneFill size={22} />
                </div>
                <div onClick={toggleOpen} className="p-3 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition">
                    <AiOutlineMenu />
                    <div className="hidden md:block gap-2">
                        <Avatar />
                    </div>
                </div>
            </div>

            {isOpen &&
                <div className="absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm">
                    <div className="flex flex-col cursor-pointer">
                        {/* <div className="sm:block md:hidden px-4 py-3 hover:bg-neutral-100 transition"> Deluxe HouseBoats </div>
                        <div className="sm:block md:hidden px-4 py-3 hover:bg-neutral-100 transition"> Premium HouseBoats</div>
                        <div className="sm:block md:hidden px-4 py-3 hover:bg-neutral-100 transition">Luxury Houseboats</div> */}
                        <hr />
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
                    </div>
                </div>
            }
        </div>
    );

};

export default RightContent