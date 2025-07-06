import { useEffect, useRef, useState } from 'react';

const useClickOutside = (initialState = false) => {
    const [isOpen, setIsOpen] = useState(initialState);
    const ref = useRef<HTMLDivElement>(null);
    const toggleRef = useRef<any>(null); // Use any to support different element types
   
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            
            // Check if click is outside both the dropdown and toggle button
            if (ref.current && !ref.current.contains(target) && 
                toggleRef.current && !toggleRef.current.contains(target)) {
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
   
    return { isOpen, setIsOpen, ref, toggleRef };
};

export default useClickOutside;