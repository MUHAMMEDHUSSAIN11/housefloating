'use client';
import React, { useCallback } from 'react'
import { AiOutlineMenu } from "react-icons/ai";
import Avatar from '../Avatar/Avatar';
import useLoginModal from '@/app/hooks/useLoginModal';
import useRegisterModal from '@/app/hooks/useRegisterModal';
import UserMenuItem from './UserMenuItem';
import useRentModal from '@/app/hooks/useRentModal';
import { useRouter } from 'next/navigation';
import * as NProgress from 'nprogress';
import isAuthority from '@/app/actions/checkAuthority';
import useClickOutside from '@/app/hooks/useClickOutside';
import useAuth from '@/app/hooks/useAuth';

const RightContent = () => {
    const loginModal = useLoginModal();
    const registerModal = useRegisterModal();
    const rentModal = useRentModal();

    // Use the custom hook instead of useState and useEffect
    const { isOpen, setIsOpen, ref, toggleRef } = useClickOutside(false);
    const { user, logout } = useAuth();
    const router = useRouter();

    const handlePush = () => {
        router.push('/cart');
        NProgress.start();
        NProgress.done();
    };

    const handleLogout = () => {
        logout();
    };

    const toggleOpen = useCallback(() => {
        setIsOpen((value) => !value);
    }, [setIsOpen]);

    const onRent = useCallback(() => {
        rentModal.onOpen();
    }, [rentModal])

    return (
        <div className="relative">
            <div className="flex flex-row items-center gap-4 ">
                <div
                    ref={toggleRef}
                    onClick={toggleOpen}
                    className="p-3 lg:py-1 lg:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-lg transition"
                >
                    <AiOutlineMenu />
                    <div className="hidden lg:block gap-2">
                        <Avatar />
                    </div>
                </div>
            </div>
            {isOpen &&
                <div
                    ref={ref}
                    className="absolute rounded-xl shadow-lg w-[40vw] lg:w-48 bg-white overflow-hidden right-0 top-12 text-sm z-[60]"
                >
                    <div className="flex flex-col cursor-pointer">
                        {user && (
                            <>
                                <UserMenuItem onClick={handleLogout} label="Logout" />
                                <hr />
                                <div className="sm:block lg:hidden px-4 py-3 hover:bg-neutral-100 transition">Contact Us</div>
                            </>
                        )}
                        {!user && (
                            <>
                                <UserMenuItem onClick={loginModal.onOpen} label="Login" />
                                <UserMenuItem onClick={registerModal.onOpen} label="Sign Up" />
                                <div className="sm:block lg:hidden px-4 py-3 hover:bg-neutral-100 transition ">Contact Us</div>
                            </>
                        )}
                        {user && isAuthority(user.id ? String(user.id) : "") && (
                            <>
                                <UserMenuItem onClick={() => router.push('/admin')} label="Reservations" />
                                <hr />
                                <UserMenuItem onClick={onRent} label="Add Listing" />
                                <hr />
                                <UserMenuItem onClick={() => router.push('/manageListings')} label="Manage Listings" />

                            </>
                        )}
                    </div>
                </div>
            }
        </div>
    );
};

export default RightContent