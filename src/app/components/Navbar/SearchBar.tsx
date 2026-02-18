import React, { useState, useRef, useEffect } from 'react';
import { Users, User, Search } from 'lucide-react';
import { format } from 'date-fns';
import { BookingType, BoatCruisesId, Categories } from '@/app/enums/enums';
import { usePathname, useRouter } from 'next/navigation';
import FormatToLocalDate from '../Misc/FormatToLocalDate';
import SearchBarMobileModal from '../Modals/SearchBarMobileModal';
import DesktopSearchBar from './DesktopSearchBar';
import useSearchStore from '@/app/hooks/useSearchStore';

const categoryOptions = [
  { id: Categories.All, label: 'All Category' },
  { id: Categories.Deluxe, label: 'Deluxe' },
  { id: Categories.Premium, label: 'Premium' },
  { id: Categories.Luxury, label: 'Luxury' },
];

const typeOptions = [
  { id: BookingType.private, label: 'Private', icon: <User /> },
  { id: BookingType.sharing, label: 'Sharing', icon: <Users /> },
];

const SearchBar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const {
    selectedCruise, setSelectedCruise,
    selectedType, setSelectedType,
    selectedDateRange, setSelectedDateRange,
    selectedCategory, setSelectedCategory,
    roomCount, setRoomCount,
    showErrors, setShowErrors,
    errors, setErrors,
    isMobileModalOpen, setIsMobileModalOpen,
    activeSection, setActiveSection,
    validateFields
  } = useSearchStore();


  const [showFilter, setShowFilter] = useState(false);

  const typeRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const datesRef = useRef<HTMLDivElement>(null);

  const isOpeningRef = useRef(false);

  useEffect(() => {
    if (activeSection || showFilter || isMobileModalOpen) {
      document.body.style.overflow = 'hidden';
      isOpeningRef.current = true;
      setTimeout(() => {
        isOpeningRef.current = false;
      }, 300); // 300ms buffer to allow layout shifts to settle
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [activeSection, showFilter, isMobileModalOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeSection === 'type' && typeRef.current && !typeRef.current.contains(event.target as Node)) {
        setActiveSection(null);
      }
      if (activeSection === 'category' && categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setActiveSection(null);
      }
      if (activeSection === 'date' && datesRef.current && !datesRef.current.contains(event.target as Node)) {
        setActiveSection(null);
      }
    };

    const handleScroll = (event: Event) => {
      // Ignore scroll events during the opening "settling" phase to prevent flickering
      if (isOpeningRef.current) {
        return;
      }

      // Only close if the scroll event target is the window or document.
      // Element-level scrolls (like inside the DateSelector) should be ignored.
      if (event.target !== window && event.target !== document) {
        return;
      }

      if (activeSection) {
        setActiveSection(null);
      }
      if (showFilter) {
        setShowFilter(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [activeSection, showFilter]);

  useEffect(() => {
    if (selectedType && errors.type) {
      setErrors(prev => ({ ...prev, type: false }));
    }
  }, [selectedType]);

  useEffect(() => {
    if (selectedCategory && errors.category) {
      setErrors(prev => ({ ...prev, category: false }));
    }
  }, [selectedCategory]);

  useEffect(() => {
    const isDateValid = !!selectedDateRange.startDate;

    if (isDateValid && errors.date) {
      setErrors(prev => ({ ...prev, date: false }));
    }
  }, [selectedDateRange, selectedCruise]);

  // useEffect removed - now handled by ListingHero or handleSearch calling setActiveSection('type')

  // Removed local validateFields as it's now in the store

  const handleSearch = async () => {
    if (!validateFields()) {
      if (window.innerWidth >= 768 && !selectedType) {
        setActiveSection('type');
      }
      return;
    }

    try {
      const params = new URLSearchParams();

      // Add required parameters
      if (selectedType) params.append('type', selectedType.toString());
      if (selectedCategory) {
        params.append('category', selectedCategory.toString());
      }
      params.append('rooms', roomCount.toString());

      // Add date parameters
      if (selectedDateRange.startDate) {
        params.append('startDate', FormatToLocalDate(selectedDateRange.startDate));

        let calculatedEndDate: Date | null = selectedDateRange.endDate;

        if (selectedCruise === BoatCruisesId.dayCruise) {
          calculatedEndDate = selectedDateRange.startDate;
        } else if (selectedCruise === BoatCruisesId.nightStay) {
          calculatedEndDate = new Date(selectedDateRange.startDate);
          calculatedEndDate.setDate(calculatedEndDate.getDate() + 1);
        }

        if (calculatedEndDate) {
          params.append('endDate', FormatToLocalDate(calculatedEndDate));
        }
      }

      // Add cruise type
      params.append('cruise', selectedCruise.toString());

      setIsMobileModalOpen(false);
      router.push(`/houseBoats?${params.toString()}`);
    } catch (error) {
      console.error('Error during search:', error);
    }
  };

  const getCategoryLabel = (type: Categories): string => {
    const option = categoryOptions.find(o => o.id === type);
    return option ? option.label : '';
  };

  const getSelectedLabel = (type: BookingType): string => {
    const option = typeOptions.find(o => o.id === type);
    return option ? option.label : '';
  };

  const getDateDisplayText = (): string => {
    if (!selectedDateRange.startDate) return '';

    if (selectedCruise === BoatCruisesId.dayNight) {
      return format(selectedDateRange.startDate, 'MMM d, yyyy');
    }

    return format(selectedDateRange.startDate, 'MMM d, yyyy');
  };

  const isSearchPerformed = pathname === '/houseBoats';

  return (
    <div className="relative w-full mb-2 lg:mb:0 lg:my-8">
      {/* Mobile Search Trigger */}
      <div className="md:hidden w-full px-4 mb-4">
        <button
          onClick={() => setIsMobileModalOpen(true)}
          className={`w-full bg-white border ${showErrors && (errors.type || errors.category || errors.date) ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-full py-3 px-4 shadow-sm flex items-center justify-between transition-colors duration-200`}
        >
          {isSearchPerformed && selectedType && selectedDateRange.startDate ? (
            <div className="flex flex-col items-center flex-1">
              <span className={`text-sm font-bold ${showErrors && (errors.type || errors.category || errors.date) ? 'text-red-600' : 'text-gray-900'}`}>
                {getSelectedLabel(selectedType)} • {getCategoryLabel(selectedCategory)}
              </span>
              <span className={`text-xs ${showErrors && (errors.type || errors.category || errors.date) ? 'text-red-500' : 'text-gray-500'}`}>
                {getDateDisplayText()} • {roomCount} {roomCount === 1 ? 'room' : 'rooms'} {selectedCruise && `• ${BoatCruisesId[selectedCruise]}`}
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-center flex-1 gap-2">
              <Search className={`w-4 h-4 ${showErrors && (errors.type || errors.category || errors.date) ? 'text-red-500' : 'text-blue-500'}`} />
              <span className={`font-semibold ${showErrors && (errors.type || errors.category || errors.date) ? 'text-red-600' : 'text-gray-800'}`}>Start your search</span>
            </div>
          )}
        </button>
      </div>

      {/* Mobile Modal */}
      {isMobileModalOpen && (
        <SearchBarMobileModal
          selectedCruise={selectedCruise}
          setSelectedCruise={setSelectedCruise}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          roomCount={roomCount}
          setRoomCount={setRoomCount}
          showErrors={showErrors}
          errors={errors}
          handleSearch={handleSearch}
          setIsMobileModalOpen={setIsMobileModalOpen}
          getSelectedLabel={getSelectedLabel}
          getCategoryLabel={getCategoryLabel}
          getDateDisplayText={getDateDisplayText}
          typeOptions={typeOptions}
          categoryOptions={categoryOptions}
        />
      )}

      <DesktopSearchBar
        typeRef={typeRef}
        categoryRef={categoryRef}
        datesRef={datesRef}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        showErrors={showErrors}
        errors={errors}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        getSelectedLabel={getSelectedLabel}
        typeOptions={typeOptions}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        getCategoryLabel={getCategoryLabel}
        categoryOptions={categoryOptions}
        roomCount={roomCount}
        setRoomCount={setRoomCount}
        selectedDateRange={selectedDateRange}
        setSelectedDateRange={setSelectedDateRange}
        getDateDisplayText={getDateDisplayText}
        selectedCruise={selectedCruise}
        setSelectedCruise={setSelectedCruise}
        handleSearch={handleSearch}
      />
    </div>
  );
};

export default SearchBar;