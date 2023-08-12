// dateStore.ts
import {create} from 'zustand';

interface DateState {
  bookingDate: Date;
  setBookingDate: (date: Date) => void;
}

const useBookingDateStore = create<DateState>((set) => ({
  bookingDate: new Date(),
  setBookingDate: (date) => set({ bookingDate: date }),
}));

export default useBookingDateStore;
