'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';

const NewMiddleContent = () => {
  const [activeTab, setActiveTab] = useState('');
  const pathname = usePathname();
  
  const tabs = [
    {
      name: 'Houseboats',
      key: 'houseboats',
      path: '/houseBoats',
      image: '/images/HB_Icon.png'
    },
    {
      name: 'Shikara',
      key: 'shikara',
      path: '/shikaras',
      image: '/images/Shikara_Icon.png'
    },
    {
      name: 'Kayaks',
      key: 'kayaks',
      path: '/kayaks',
      image: '/images/Kayak_Icon.png'
    }
  ];

  // Set active tab based on current pathname
  useEffect(() => {
    const currentTab = tabs.find(tab => tab.path === pathname);
    if (currentTab) {
      setActiveTab(currentTab.name);
    } else {
      setActiveTab(''); // Clear active tab if not on any of these pages
    }
  }, [pathname]);

  return (
    <div className="flex flex-row items-center justify-center">
      <div className="flex items-center space-x-8">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={tab.path}
            className={`relative flex flex-col items-center px-2 md:px-4 py-3 transition-all duration-200 cursor-pointer group
              ${activeTab === tab.name
                ? 'text-black'
                : 'text-gray-500 hover:text-gray-700'
              }
            `}
          >
            <div className="mb-2 transform transition-transform duration-200 group-hover:scale-110">
              <Image
                className="rounded-full"
                src={tab.image}
                alt={tab.name}
                height="80"
                width="80"
              />
            </div>
            <span className="text-sm font-medium">{tab.name}</span>
            {activeTab === tab.name && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NewMiddleContent;