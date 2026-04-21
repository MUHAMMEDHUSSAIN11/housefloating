'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaWhatsapp, FaTimes, FaCalendarAlt, FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, FieldValues } from 'react-hook-form';
import Counter from '../Inputs/Counter';
import { format } from 'date-fns';

interface CustomSelectProps {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ label, value, options, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-4 pb-1 bg-white border md:border-2 rounded-xl outline-none transition cursor-pointer items-center 
                    ${isOpen ? 'border-blue-500 ring-2 ring-blue-100' : 'border-neutral-200 hover:border-neutral-300'}
                `}
            >
                <label className="text-[10px] md:text-[12px] text-neutral-500 font-medium pointer-events-none">
                    {label}
                </label>
                <div className='flex items-center justify-between'>
                    <span className="font-light text-neutral-800 text-xs md:text-base">{value}</span>
                    <FaChevronDown className={`text-neutral-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
                
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 5, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute z-20 w-full bg-white border border-neutral-200 rounded-2xl shadow-xl overflow-hidden"
                    >
                        {options.map((option) => (
                            <div 
                                key={option}
                                onClick={() => {
                                    onChange(option);
                                    setIsOpen(false);
                                }}
                                className={`p-4 hover:bg-blue-50 transition-colors cursor-pointer text-xs md:text-sm font-medium
                                    ${value === option ? 'text-blue-600 bg-blue-50/50' : 'text-neutral-700'}
                                `}
                            >
                                {option}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const WhatsAppWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [roomCount, setRoomCount] = useState(1);
    const [adultCount, setAdultCount] = useState(2);
    const [bookingDate, setBookingDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    // Form state managed manually for selections to ensure premium UI
    const [bookingType, setBookingType] = useState('Private');
    const [boatCategory, setBoatCategory] = useState('Luxury');
    const [cruiseType, setCruiseType] = useState('Daycruise');

    const {
        handleSubmit,
        reset
    } = useForm<FieldValues>();

    const onSubmit = () => {
    const message = 
    `HOUSEBOAT INQUIRY

Hello Housefloating Team!

I am looking for a houseboat with the following preferences:
━━━━━━━━━━━━━━━
BOOKING DETAILS
━━━━━━━━━━━━━━━
- Booking Type: ${bookingType}
- Boat Category: ${boatCategory}
- Cruise Type: ${cruiseType}
- Check-in Date: ${format(new Date(bookingDate), 'dd MMM yyyy')}
- Number of Rooms: ${roomCount}
- Number of Adults: ${adultCount}
━━━━━━━━━━━━━━━
Please help me find the best available option. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919207777911?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
};

    return (
        <div className="fixed top-1 bottom-40 md:bottom-15 right-4 z-9999 flex flex-col justify-end items-end pointer-events-none">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 50 }}
                        className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-2 w-[90vw] max-w-95 border border-neutral-100 pointer-events-auto flex flex-col max-h-full"
                    >
                        {/* Header */}
                        <div className="bg-linear-to-r from-[#25D366] to-[#128C7E] px-4 py-2 flex items-center justify-between text-white">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2 rounded-full">
                                    <FaWhatsapp size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm md:text-base leading-tight">Houseboat Booking</h3>
                                    <p className="text-[10px] md:text-xs text-white/80">Typical reply in minutes</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="hover:bg-black/10 p-2 rounded-full transition-colors cursor-pointer"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>

                        {/* Welcome Message */}
                        <div className="bg-neutral-50 p-2 border-b border-neutral-100 italic text-[10px] md:text-xs text-neutral-600">
                            "Hi there! Please select your preferences below for a quick WhatsApp quote."
                        </div>

                        {/* Form */}
                        <div className="p-2 flex-1 overflow-y-auto custom-scrollbar bg-white">
                           <div className="space-y-2">
                                {/* Booking Type */}
                                <CustomSelect 
                                    label="Booking Type"
                                    value={bookingType}
                                    options={['Private', 'Sharing']}
                                    onChange={(val) => setBookingType(val)}
                                />

                                {/* Boat Category */}
                                <CustomSelect 
                                    label="Boat Category"
                                    value={boatCategory}
                                    options={['Luxury', 'Premium', 'Deluxe']}
                                    onChange={(val) => setBoatCategory(val)}
                                />

                                {/* Booking Date */}
                                <div className="relative">
                                    <div className="flex flex-col px-4 py-1 focus:border-blue-500 bg-white border md:border-2 border-neutral-200 rounded-xl">
                                        <label className="text-[10px] md:text-[12px]  text-neutral-500 font-medium">
                                            Booking Date
                                        </label>
                                        <input 
                                            type="date"
                                            value={bookingDate}
                                            min={format(new Date(), 'yyyy-MM-dd')}
                                            className="w-full text-xs md:text-base  transition font-light outline-none"
                                            onChange={(e) => setBookingDate(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Guests and Rooms */}
                                <div className="bg-neutral-50 px-4 text-xs md:text-base rounded-xl space-y-1 border border-neutral-100">
                                    <Counter
                                        title="Rooms"
                                        subtitle="Total rooms"
                                        value={roomCount}
                                        onChange={(value) => setRoomCount(value)}
                                        min={1}
                                    />
                                    <div className="h-px bg-neutral-200 w-full" />
                                    <Counter
                                        title="Adults"
                                        subtitle="Total guests"
                                        value={adultCount}
                                        onChange={(value) => setAdultCount(value)}
                                        min={1}
                                    />
                                </div>

                                {/* Cruise Type */}
                                <CustomSelect 
                                    label="Cruise Type"
                                    value={cruiseType}
                                    options={['Daycruise', 'Daynight', 'Nightstay']}
                                    onChange={(val) => setCruiseType(val)}
                                />
                                
                                <button
                                    onClick={onSubmit}
                                    className="w-full bg-[#25D366] text-white py-2 md:py-3 rounded-xl font-bold hover:bg-[#128C7E] transition-all duration-300 flex items-center justify-center gap-3 mt-2 shadow-[0_10px_20px_rgba(37,211,102,0.3)] active:scale-[0.98]"
                                >
                                    <FaWhatsapp size={20} />
                                    Send Booking Inquiry
                                </button>
                                
                                <p className="text-[10px] text-center text-neutral-400">
                                    By clicking this button, you'll be redirected to WhatsApp.
                                </p>
                           </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="bg-[#25D366] text-white p-2 rounded-full shadow-2xl hover:shadow-[0_15px_30px_rgba(37,211,102,0.4)] transition-all duration-300 flex items-center justify-center pointer-events-auto relative group"
            >
                {isOpen ? (
                    <FaTimes size={30} />
                ) : (
                    <>
                        <FaWhatsapp size={30} />
                        <span className="absolute right-full mr-4 bg-white text-neutral-800 px-4 py-2 rounded-xl text-sm font-semibold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden md:block">
                            Book via WhatsApp
                        </span>
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white"></span>
                        </span>
                    </>
                )}
            </motion.button>
        </div>
    );
};

export default WhatsAppWidget;
