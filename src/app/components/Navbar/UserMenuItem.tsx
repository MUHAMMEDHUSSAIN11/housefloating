"use client";
import React from 'react';

interface UserMenuItemProps {
    onClick: () => void;
    label: string;
}

const UserMenuItem: React.FC<UserMenuItemProps> = ({ onClick, label }) => {
    return (
        <div 
            onClick={onClick} 
            className="px-4 py-3 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 cursor-pointer text-gray-700 font-medium border-l-4 border-transparent hover:border-blue-500 truncate"
            title={label}
        >
            {label}
        </div>
    );
}

export default UserMenuItem;