'use client';

import { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { initializeStore, AppStore } from '../lib/store';
import { initializeAuth } from '../lib/features/authSlice';

export default function StoreProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const storeRef = useRef<AppStore | null>(null);
    if (!storeRef.current) {
        // Create the store instance the first time this renders
        storeRef.current = initializeStore();
    }

    useEffect(() => {
        if (storeRef.current) {
            storeRef.current.dispatch(initializeAuth());
        }
    }, []);

    return <Provider store={storeRef.current!}>{children}</Provider>;
}
