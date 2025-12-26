'use client';
import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import * as NProgress from 'nprogress';
import useLoginModal from '@/app/hooks/useLoginModal';
import useAuth from '@/app/hooks/useAuth';

const NavbarIcons: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useAuth();
    const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
    const loginModal = useLoginModal();

    const isWishlistActive = pathname === '/wishlist';
    const isCartActive = pathname === '/cart';

    useEffect(() => {
        if (user && pendingNavigation) {
            NProgress.start();
            router.push(pendingNavigation);
            NProgress.done();
            setPendingNavigation(null);
        }
    }, [user, pendingNavigation, router]);

    const handleCartPush = () => {
        if (!user) {
            setPendingNavigation('/cart');
            loginModal.onOpen();
        } else {
            router.push('/cart');
            NProgress.start();
            NProgress.done();
        }
    };

    const handleWishlistPush = () => {
        if (!user) {
            setPendingNavigation('/wishlists');
            loginModal.onOpen();
        } else {
            router.push('/wishlists');
            NProgress.start();
            NProgress.done();
        }
    };

    return (
        <div className="hidden md:flex flex-row items-center gap-3">
            <div
                className="p-2 cursor-pointer hover:shadow-md transition rounded-full flex items-center justify-center group"
                onClick={handleWishlistPush}
                title="Wishlist"
            >
                <Heart
                    className={`w-6 h-6 transition-colors duration-200 ${isWishlistActive
                            ? 'text-blue-500'
                            : 'text-gray-600 group-hover:text-blue-500'
                        }`}
                    fill={isWishlistActive ? "currentColor" : "none"}
                />
            </div>
            <div
                className="p-2 cursor-pointer hover:shadow-md transition rounded-full flex items-center justify-center group"
                onClick={handleCartPush}
                title="Cart"
            >
                <ShoppingCart
                    className={`w-6 h-6 transition-colors duration-200 ${isCartActive
                            ? 'text-blue-500'
                            : 'text-gray-600 group-hover:text-blue-500'
                        }`}
                />
            </div>
        </div>
    );
};

export default NavbarIcons;