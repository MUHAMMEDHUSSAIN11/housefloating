'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

const Categories = () => {
    const router = useRouter();

    return (
        <section className="py-16 bg-gray-200S px-1 font-sans">
            <div className="max-w-7xl mx-auto pb-16">
                <h2 className="text-3xl font-semibold text-center font-sans text-gray-800 mb-5">Houseboat Categories</h2>
            </div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Deluxe Houseboat */}
                <div onClick={() => router.push('/boats')} className="bg-white rounded-lg shadow-lg cursor-pointer">
                    <div className="relative aspect-w-16 aspect-h-9 px-1">
                        <Image
                            src="/images/deluxe.jpg"
                            alt="Deluxe Houseboat"
                            width={500}
                            height={500}
                            className="rounded-lg"
                        />
                    </div>
                    <div className="p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Deluxe Houseboat</h2>
                        <p className="text-gray-600">
                            Experience affordable luxury with our Deluxe Kerala houseboats. Features include:<br/>
                        </p>
                        <p className="pl-0 mt-4">
                            Comfortable and budget-friendly.<br />
                            AC operational from 9 pm to 6 am.<br />
                            All basic amenities included.
                        </p>
                    </div>
                </div>
                {/* Premium Houseboat */}
                <div onClick={() => router.push('/boats')} className="bg-white rounded-lg shadow-lg cursor-pointer">
                    <div className="relative aspect-w-16 aspect-h-9">
                        <Image
                            src="/images/premium2.jpg"
                            alt="Premium Houseboat"
                            width={500}
                            height={500}
                            className="rounded-lg"
                        />
                    </div>
                    <div className="p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Premium Houseboat</h2>
                        <p className="text-gray-600">
                            Indulge in luxury with our Premium Kerala houseboats. Highlights include:
                        </p>
                        <p className="pl-0 mt-4">
                            Full-time air conditioning for ultimate comfort.<br/>
                            A blend of tradition and modern amenities.<br/>
                            Elevated luxury and relaxation.
                        </p>
                    </div>
                </div>
                {/* Luxury Houseboat */}
                <div onClick={() => router.push('/boats')} className="bg-white rounded-lg shadow-lg cursor-pointer">
                    <div className="relative aspect-w-16 aspect-h-9">
                        <Image
                            src="/images/premium.jpg"
                            alt="Luxury Houseboat"
                            width={500}
                            height={500}
                            className="rounded-lg"
                        />
                    </div>
                    <div className="p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Luxury Houseboat</h2>
                        <p className="text-gray-600">
                            Experience opulence with our Luxury Kerala houseboats. Features include:
                        </p>
                        <p className="pl-0 mt-4">
                            Glass windows spanning the entire wall.<br/>
                            Conference Hall for special gatherings.<br/>
                            Jacuzzi and hot water facilities in some luxury houseboats.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Categories;


