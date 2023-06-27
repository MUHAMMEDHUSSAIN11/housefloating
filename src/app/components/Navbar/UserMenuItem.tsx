"use client";

import React from 'react';


interface UserMenuItemProps  {
    onClick: () => void;
    label: string;
}

const UserMenuItem: React.FC<UserMenuItemProps> = (props) => {
    return (
        <div onClick={props.onClick} className="px-4 py-3 hover:bg-neutral-100 transition">
            {props.label}
        </div>
    );
}



export default UserMenuItem;