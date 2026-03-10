import { create } from 'zustand';

interface SuccessStore {
    bookingData: {
        bookingId: string;
        boatName: string;
        tripDate: string;
        totalPrice: string;
        advanceAmount: string;
        guestCount: string;
        boardingPoint: string;
    } | null;
    setBookingData: (data: SuccessStore['bookingData']) => void;
    clearBookingData: () => void;
}

const useSuccessStore = create<SuccessStore>((set) => ({
    bookingData: null,
    setBookingData: (data) => set({ bookingData: data }),
    clearBookingData: () => set({ bookingData: null }),
}));

export default useSuccessStore;
