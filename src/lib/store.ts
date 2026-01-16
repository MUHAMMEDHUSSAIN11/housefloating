import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            auth: authReducer,
        },
    });
};

// Singleton store instance for client-side use
export let store: AppStore | undefined;

export const initializeStore = () => {
    const _store = makeStore();
    store = _store;
    return _store;
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
