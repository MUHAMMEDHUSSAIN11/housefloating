import { create } from 'zustand';
import { BoatCruisesId, BookingType, Categories } from '@/app/enums/enums';

interface DateRange {
    startDate: Date | null;
    endDate: Date | null;
}

interface SearchErrors {
    type: boolean;
    category: boolean;
    date: boolean;
}

interface SearchStore {
    selectedCruise: BoatCruisesId;
    selectedType: BookingType | null;
    selectedDateRange: DateRange;
    selectedCategory: Categories;
    roomCount: number;
    showErrors: boolean;
    errors: SearchErrors;
    isMobileModalOpen: boolean;

    // Actions
    setSelectedCruise: (value: BoatCruisesId | ((prev: BoatCruisesId) => BoatCruisesId)) => void;
    setSelectedType: (value: BookingType | null | ((prev: BookingType | null) => BookingType | null)) => void;
    setSelectedDateRange: (value: DateRange | ((prev: DateRange) => DateRange)) => void;
    setSelectedCategory: (value: Categories | ((prev: Categories) => Categories)) => void;
    setRoomCount: (value: number | ((prev: number) => number)) => void;
    setShowErrors: (value: boolean | ((prev: boolean) => boolean)) => void;
    setErrors: (value: SearchErrors | ((prev: SearchErrors) => SearchErrors)) => void;
    setIsMobileModalOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
    validateFields: () => boolean;
    clearErrors: () => void;
}

const useSearchStore = create<SearchStore>((set, get) => ({
    selectedCruise: BoatCruisesId.overNightCruise,
    selectedType: null,
    selectedDateRange: { startDate: null, endDate: null },
    selectedCategory: Categories.All,
    roomCount: 1,
    showErrors: false,
    errors: {
        type: false,
        category: false,
        date: false,
    },
    isMobileModalOpen: false,

    setSelectedCruise: (value) => set((state) => ({
        selectedCruise: typeof value === 'function' ? value(state.selectedCruise) : value
    })),
    setSelectedType: (value) => set((state) => ({
        selectedType: typeof value === 'function' ? value(state.selectedType) : value
    })),
    setSelectedDateRange: (value) => set((state) => ({
        selectedDateRange: typeof value === 'function' ? value(state.selectedDateRange) : value
    })),
    setSelectedCategory: (value) => set((state) => ({
        selectedCategory: typeof value === 'function' ? value(state.selectedCategory) : value
    })),
    setRoomCount: (value) => set((state) => ({
        roomCount: typeof value === 'function' ? value(state.roomCount) : value
    })),
    setShowErrors: (value) => set((state) => ({
        showErrors: typeof value === 'function' ? value(state.showErrors) : value
    })),
    setErrors: (value) => set((state) => ({
        errors: typeof value === 'function' ? value(state.errors) : value
    })),
    setIsMobileModalOpen: (value) => set((state) => ({
        isMobileModalOpen: typeof value === 'function' ? value(state.isMobileModalOpen) : value
    })),

    validateFields: () => {
        const { selectedType, selectedCategory, selectedDateRange } = get();
        const newErrors = {
            type: !selectedType,
            category: !selectedCategory,
            date: !selectedDateRange.startDate,
        };
        set({ errors: newErrors, showErrors: true });
        return !Object.values(newErrors).some(error => error);
    },

    clearErrors: () => set({ showErrors: false, errors: { type: false, category: false, date: false } }),
}));

export default useSearchStore;
