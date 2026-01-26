'use client';
import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import useLoginModal from '@/app/hooks/useLoginModal';
import NProgress from 'nprogress';
import useAuth from '@/app/hooks/useAuth';

const BottomNavbar = () => {
    const { user } = useAuth();
    const [pendingNavigation, setPendingNavigation] = useState('');
    const router = useRouter();
    const pathname = usePathname();
    const isListingPage = pathname?.startsWith('/listings/');
    const loginModal = useLoginModal();

    // Determine active tab based on current pathname
    const getActiveTab = () => {
        if (pathname === '/wishlists') return 'wishlist';
        if (pathname === '/cart') return 'cart';
        return '';
    };

    // Handle navigation after user logs in
    useEffect(() => {
        if (user && pendingNavigation) {
            // User is now logged in and we have a pending navigation
            NProgress.start();
            router.push(pendingNavigation);
            NProgress.done();
            setPendingNavigation(''); // Clear pending navigation
        }
    }, [user, pendingNavigation, router]);

    const handleWishlistClick = () => {
        if (!user) {
            setPendingNavigation('/wishlists');
            loginModal.onOpen();
        } else {
            router.push('/wishlists');
            NProgress.start();
            NProgress.done();
        }
    };

    const handleCartClick = () => {
        if (!user) {
            setPendingNavigation('/cart');
            loginModal.onOpen();
        } else {
            router.push('/cart');
            NProgress.start();
            NProgress.done();
        }
    };

    const tabs = [
        {
            id: 'wishlist',
            icon: Heart,
            label: 'Wishlists',
            color: 'text-blue-500',
            onClick: handleWishlistClick
        },
        {
            id: 'cart',
            icon: ShoppingCart,
            label: 'Cart',
            color: 'text-blue-500',
            onClick: handleCartClick
        }
    ];

    const activeTab = getActiveTab();

    return (
        <div className={`fixed ${isListingPage ? 'hidden' : 'bottom-0 border-t ' } left-0 right-0 bg-white border-gray-200 md:hidden z-40`}>
            <div className='flex flex-row justify-around items-center py-2 px-1'>
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button  
                            key={tab.id}
                            onClick={tab.onClick}
                            className='flex flex-col items-center justify-center flex-1 py-2 px-1 transition-colors duration-200'
                        >
                            <div className='flex flex-col items-center space-y-1 hover:text-blue-400'>
                                <Icon
                                    className={`w-6 h-6 ${isActive ? tab.color : 'text-gray-400'
                                        } transition-colors duration-200`}
                                    fill={isActive && tab.id === 'wishlist' ? 'currentColor' : 'none'}
                                />
                                <span
                                    className={`text-xs font-medium ${isActive ? tab.color : 'text-gray-400'
                                        } transition-colors duration-200`}
                                >
                                    {tab.label}
                                </span>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default BottomNavbar