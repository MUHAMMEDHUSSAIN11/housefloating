//this modal is used for the confirmation modal while submitting booking request.

import { create } from "zustand";

interface ConfirmModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const useBookingConfirmModal = create<ConfirmModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));

export default useBookingConfirmModal