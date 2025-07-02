import { useEffect, useRef, useState } from 'react';

const useClickOutside = (initialState = false) => {
    const [isOpen, setIsOpen] = useState(initialState);
    const ref = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);
    
    return { isOpen, setIsOpen, ref };
};

export default useClickOutside;