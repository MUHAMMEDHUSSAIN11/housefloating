'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Calendar, Users, Ship, MapPin, Mail, ArrowRight } from 'lucide-react';
import useSuccessStore from '@/app/hooks/useSuccessStore';

const SuccessPage = () => {
    const router = useRouter();
    const { bookingData } = useSuccessStore();

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Conversion Tracking: Only fire if real booking data exists
    useEffect(() => {
        if (bookingData) {
            // 1. Google Tag Manager Event (purchase_success)
            const dataLayer = (window as any).dataLayer || [];
            (window as any).dataLayer = dataLayer;
            dataLayer.push({
                event: 'purchase_success',
                bookingId: bookingData.bookingId,
                amount: bookingData.totalPrice,
                advanceAmount: bookingData.advanceAmount,
                boatName: bookingData.boatName,
                currency: 'INR'
            });

            // 2. Google Ads Conversion Snippet
            if (typeof (window as any).gtag === 'function') {
                (window as any).gtag('event', 'conversion', {
                    'send_to': 'AW-17980296798/1gB4CKPK84YcEN6clvlC',
                    'value': Number(bookingData.advanceAmount) || 1.0,
                    'currency': 'INR',
                    'transaction_id': bookingData.bookingId
                });
            }
        }
    }, [bookingData]);

    // fallback for direct access without booking data
    if (!bookingData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-blue-50 p-6 rounded-full mb-6">
                    <Ship className="h-12 w-12 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">No Booking Found</h1>
                <p className="text-gray-500 mb-8 max-w-xs">It seems you&apos;ve reached this page directly or refreshed it. Please check your email or visit your cart for booking history.</p>
                <button
                    onClick={() => router.push('/')}
                    className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-md active:scale-95"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    const {
        bookingId,
        boatName,
        tripDate,
        totalPrice,
        advanceAmount,
        guestCount,
        boardingPoint
    } = bookingData;

    const details = [
        { icon: Ship, label: 'Boat House', value: boatName },
        { icon: Calendar, label: 'Trip Date', value: tripDate },
        { icon: Users, label: 'Guests', value: `${guestCount} Guests` },
        ...(boardingPoint
            ? [{ icon: MapPin, label: 'Boarding Point', value: boardingPoint }]
            : []),
    ];

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 pt-40 pb-20 bg-neutral-50">

            {/* Decorative background blobs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-green-500/5 blur-3xl" />
                <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-0">

                {/* ── Left: Hero section ── */}
                <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left lg:pr-12">

                    {/* Check icon */}
                    <div className="flex items-center justify-center h-20 w-20 rounded-full bg-linear-to-tr from-green-500 to-green-400 shadow-lg shadow-green-500/20 mb-5">
                        <CheckCircle2 className="h-12 w-12 text-white" />
                    </div>

                    {/* Badge */}
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold uppercase tracking-wider mb-4">
                        Payment Successful
                    </span>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-3">
                        Booking
                        <br />
                        Confirmed!
                    </h1>

                    <p className="text-gray-500 text-sm md:text-base max-w-sm mb-8">
                        Your reservation is secured. A confirmation has been sent to your
                        registered email address.
                    </p>

                    {/* CTA Buttons — desktop only */}
                    <div className="hidden lg:flex flex-col gap-3 w-full max-w-xs">
                        <button
                            onClick={() => router.push('/cart')}
                            className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                        >
                            Go to My Cart
                            <ArrowRight size={18} />
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="w-full text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors py-2"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>

                {/* ── Right: Booking details card ── */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-200/50 p-5 md:p-7 flex flex-col">

                    {/* Booking ID header */}
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Booking ID
                        </span>
                        <span className="text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
                            #{bookingId}
                        </span>
                    </div>

                    {/* Detail rows */}
                    <div className="py-5 space-y-4 flex-1">
                        {details.map((item) => (
                            <div key={item.label} className="flex items-start gap-3.5 px-1 py-1">
                                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-blue-50 shrink-0">
                                    <item.icon size={18} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">{item.label}</p>
                                    <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Price section */}
                    <div className="pt-4 border-t border-gray-200 space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500 font-medium">Total Price</span>
                            <span className="text-sm text-gray-400 line-through">₹{totalPrice}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-base font-semibold text-gray-900">Advance Paid</span>
                            <span className="text-2xl font-extrabold text-green-500">₹{advanceAmount}</span>
                        </div>
                    </div>

                    {/* Email notice */}
                    <div className="mt-5 flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-3">
                        <Mail size={16} className="text-gray-500 shrink-0" />
                        <p className="text-xs text-gray-500">
                            Confirmation email sent to your registered address
                        </p>
                    </div>

                    {/* Mobile CTA */}
                    <div className="flex lg:hidden flex-col gap-3 mt-5">
                        <button
                            onClick={() => router.push('/cart')}
                            className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-lg active:scale-[0.98]"
                        >
                            Go to My Cart
                            <ArrowRight size={18} />
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="w-full text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors py-2"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SuccessPage;