import { BoatCruisesId, BookingType, Categories } from "@/app/enums/enums";
import { Calendar, ChevronDown, Minus, Plus, Search, Ship, User } from "lucide-react";
import DateSelector from "../Navbar/DateSelector";
import React, { useState, useRef, useEffect } from "react";

interface SearchBarMobileModalProps {
  setIsMobileModalOpen: (isOpen: boolean) => void;
  selectedType: BookingType | null;
  setSelectedType: (type: BookingType | null) => void;
  selectedCategory: Categories;
  setSelectedCategory: (category: Categories) => void;
  getSelectedLabel: (typeId: BookingType) => string;
  getCategoryLabel: (category: Categories) => string;
  getDateDisplayText: () => string;
  typeOptions: { id: BookingType; label: string; icon: React.ReactNode; }[];
  categoryOptions: { id: Categories; label: string; }[];
  roomCount: number;
  setRoomCount: (count: number) => void;
  guestCount: number;
  setGuestCount: (count: number) => void;
  selectedDateRange: { startDate: Date | null; endDate: Date | null; };
  setSelectedDateRange: (range: { startDate: Date | null; endDate: Date | null; }) => void;
  selectedCruise: BoatCruisesId;
  setSelectedCruise: (value: BoatCruisesId | ((prev: BoatCruisesId) => BoatCruisesId)) => void;
  showErrors: boolean;
  errors: { type: boolean; category: boolean; date: boolean; };
  handleSearch: () => void;
  onClose?: () => void;
}

const SearchBarMobileModal: React.FC<SearchBarMobileModalProps> = ({
  setIsMobileModalOpen,
  selectedType,
  setSelectedType,
  selectedCategory,
  setSelectedCategory,
  getCategoryLabel,
  getSelectedLabel,
  getDateDisplayText,
  typeOptions,
  categoryOptions,
  roomCount,
  setRoomCount,
  guestCount,
  setGuestCount,
  selectedDateRange,
  setSelectedDateRange,
  selectedCruise,
  setSelectedCruise,
  showErrors,
  errors,
  handleSearch,
  onClose,
}) => {
  const [mobileActiveSection, setMobileActiveSection] = useState<'type' | 'category' | 'date' | null>('type');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mobileActiveSection === 'date' && scrollContainerRef.current) {
      // Use a timeout to wait for the expansion animation (duration-300)
      const timeoutId = setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({
            top: scrollContainerRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 350);
      return () => clearTimeout(timeoutId);
    }
  }, [mobileActiveSection]);

  return (
    <div className="fixed inset-0 z-60 bg-white flex flex-col md:hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <button
          onClick={() => setIsMobileModalOpen(false)}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <Plus className="w-6 h-6 rotate-45" />
        </button>
        <h2 className="text-lg font-bold">Search boats</h2>
        <div className="w-8" /> {/* Spacer */}
      </div>

      {/* Content */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 bg-gray-50"
      >
        {/* Type Selection Pill */}
        <div
          className={`rounded-3xl border transition-all duration-300 overflow-hidden shadow-sm ${mobileActiveSection === 'type' ? 'bg-white border-blue-200' :
            showErrors && errors.type ? 'bg-red-50 border-red-300' : 'bg-white border-gray-100'
            }`}
        >
          <button
            onClick={() => setMobileActiveSection(mobileActiveSection === 'type' ? null : 'type')}
            className={`w-full px-5 py-4 flex items-center justify-between text-left ${showErrors && errors.type && mobileActiveSection !== 'type' ? 'text-red-500' : ''}`}
          >
            <div className="flex items-center gap-3">
              <User className={`w-5 h-5 ${mobileActiveSection === 'type' ? 'text-blue-500' : ''}`} />
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Booking Type</p>
                <p className="font-bold text-gray-900">
                  {selectedType ? getSelectedLabel(selectedType) : 'Select Type'}
                </p>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${mobileActiveSection === 'type' ? 'rotate-180 text-blue-500' : 'text-gray-400'}`} />
          </button>

          <div className={`transition-all duration-300 ${mobileActiveSection === 'type' ? 'max-h-64 opacity-100 p-4 pt-0' : 'max-h-0 opacity-0 pointer-events-none'}`}>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {typeOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSelectedType(option.id);
                    setMobileActiveSection('category');
                  }}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${selectedType === option.id
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-100 bg-gray-50 text-gray-600'
                    }`}
                >
                  <div className="text-2xl mb-1">{option.icon}</div>
                  <span className="text-sm font-bold">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category selection Pill */}
        <div
          className={`rounded-3xl border transition-all duration-300 overflow-hidden shadow-sm ${mobileActiveSection === 'category' ? 'bg-white border-blue-200' :
            showErrors && errors.category ? 'bg-red-50 border-red-300' : 'bg-white border-gray-100'
            }`}
        >
          <button
            onClick={() => setMobileActiveSection(mobileActiveSection === 'category' ? null : 'category')}
            className={`w-full px-5 py-4 flex items-center justify-between text-left ${showErrors && errors.category && mobileActiveSection !== 'category' ? 'text-red-500' : ''}`}
          >
            <div className="flex items-center gap-3">
              <Ship className={`w-5 h-5 ${mobileActiveSection === 'category' ? 'text-blue-500' : ''}`} />
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Category</p>
                <p className="font-bold text-gray-900">
                  {getCategoryLabel(selectedCategory)}
                </p>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${mobileActiveSection === 'category' ? 'rotate-180 text-blue-500' : 'text-gray-400'}`} />
          </button>

          <div className={`transition-all duration-300 ${mobileActiveSection === 'category' ? 'max-h-125 opacity-100 p-4 pt-0' : 'max-h-0 opacity-0 pointer-events-none'}`}>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-2">
                {categoryOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSelectedCategory(option.id);
                      setMobileActiveSection('date');
                    }}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${selectedCategory === option.id
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-100 bg-gray-50 text-gray-600'
                      }`}
                  >
                    <span className="text-sm font-bold">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Date Selection Pill */}
        <div
          className={`rounded-3xl border transition-all duration-300 overflow-hidden shadow-sm ${mobileActiveSection === 'date' ? 'bg-white border-blue-200' :
            showErrors && errors.date ? 'bg-red-50 border-red-300' : 'bg-white border-gray-100'
            }`}
        >
          <button
            onClick={() => setMobileActiveSection(mobileActiveSection === 'date' ? null : 'date')}
            className={`w-full px-5 py-4 flex items-center justify-between text-left ${showErrors && errors.date && mobileActiveSection !== 'date' ? 'text-red-500' : ''}`}
          >
            <div className="flex items-center gap-3">
              <Calendar className={`w-5 h-5 ${mobileActiveSection === 'date' ? 'text-blue-500' : ''}`} />
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  {selectedCruise === BoatCruisesId.dayCruise ? 'Guests, Dates & Cruise' : 'Rooms, Dates & Cruise'}
                </p>
                <p className="font-bold text-gray-900 truncate max-w-[200]">
                  {selectedCruise === BoatCruisesId.dayCruise
                    ? `${guestCount} ${guestCount === 1 ? 'Guest' : 'Guests'}`
                    : `${roomCount} ${roomCount === 1 ? 'Room' : 'Rooms'}`
                  } • {selectedDateRange.startDate ? getDateDisplayText() : 'Select Dates'}
                </p>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${mobileActiveSection === 'date' ? 'rotate-180 text-blue-500' : 'text-gray-400'}`} />
          </button>

          <div className={`transition-all duration-300 ${mobileActiveSection === 'date' ? 'max-h-150 opacity-100 p-2' : 'max-h-0 opacity-0 pointer-events-none'}`}>
            <div className="bg-white rounded-2xl overflow-hidden mt-1 p-4 shadow-inner">
              <div className="flex items-center justify-between mb-4 bg-gray-50 p-4 rounded-2xl">
                <span className="font-bold text-gray-700">
                  {selectedCruise === BoatCruisesId.dayCruise ? 'Number of Guests' : 'Number of Rooms'}
                </span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (selectedCruise === BoatCruisesId.dayCruise) {
                        setGuestCount(Math.max(1, guestCount - 1));
                      } else {
                        setRoomCount(Math.max(1, roomCount - 1));
                      }
                    }}
                    className="w-10 h-10 rounded-full border border-gray-300 bg-white flex items-center justify-center hover:border-blue-500 transition-colors shadow-sm"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-4 text-center font-black text-lg">
                    {selectedCruise === BoatCruisesId.dayCruise ? guestCount : roomCount}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (selectedCruise === BoatCruisesId.dayCruise) {
                        setGuestCount(guestCount + 1);
                      } else {
                        setRoomCount(roomCount + 1);
                      }
                    }}
                    className="w-10 h-10 rounded-full border border-gray-300 bg-white flex items-center justify-center hover:border-blue-500 transition-colors shadow-sm"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <hr className="mb-4 border-gray-100" />
              <DateSelector
                selectedCruise={selectedCruise}
                setSelectedCruise={setSelectedCruise}
                selected={selectedDateRange}
                onSelect={(dates) => {
                  setSelectedDateRange(dates);
                  // Auto-close on any valid selection (all types are now single-date)
                  if (dates.startDate) {
                    setMobileActiveSection(null);
                  }
                }}
                onClose={() => setMobileActiveSection(null)}
                inline={true}
                bookingTypeId={selectedType}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex items-center justify-between z-50">
        <button
          onClick={() => {
            setSelectedType(null);
            setSelectedDateRange({ startDate: null, endDate: null });
            setSelectedCategory(Categories.All);
            setRoomCount(1);
            setGuestCount(1);
          }}
          className="text-gray-500 font-semibold underline px-2"
        >
          Clear all
        </button>
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200"
        >
          <Search className="w-5 h-5" />
          Search
        </button>
      </div>
    </div>
  );
}

export default SearchBarMobileModal;