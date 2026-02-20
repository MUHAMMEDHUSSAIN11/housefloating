import React from 'react';
import { Ship, Calendar, ChevronDown, User, Users, Plus, Minus, Search } from 'lucide-react';
import { BoatCruisesId, BookingType, Categories } from '@/app/enums/enums';
import DateSelector from './DateSelector';

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface DesktopSearchBarProps {
  typeRef: React.RefObject<HTMLDivElement | null>;
  categoryRef: React.RefObject<HTMLDivElement | null>;
  datesRef: React.RefObject<HTMLDivElement | null>;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
  showErrors: boolean;
  errors: {
    type: boolean;
    category: boolean;
    date: boolean;
  };
  selectedType: BookingType | null;
  setSelectedType: (type: BookingType | null) => void;
  getSelectedLabel: (type: BookingType) => string;
  typeOptions: {
    id: BookingType;
    label: string;
    icon: React.ReactNode;
  }[];
  selectedCategory: Categories;
  setSelectedCategory: (category: Categories) => void;
  getCategoryLabel: (type: Categories) => string;
  categoryOptions: {
    id: Categories;
    label: string;
  }[];
  roomCount: number;
  setRoomCount: React.Dispatch<React.SetStateAction<number>>;
  selectedDateRange: DateRange;
  setSelectedDateRange: (range: DateRange) => void;
  getDateDisplayText: () => string;
  selectedCruise: BoatCruisesId;
  setSelectedCruise: React.Dispatch<React.SetStateAction<BoatCruisesId>>;
  handleSearch: () => void;
}

const DesktopSearchBar: React.FC<DesktopSearchBarProps> = ({
  typeRef,
  categoryRef,
  datesRef,
  activeSection,
  setActiveSection,
  showErrors,
  errors,
  selectedType,
  setSelectedType,
  getSelectedLabel,
  typeOptions,
  selectedCategory,
  setSelectedCategory,
  getCategoryLabel,
  categoryOptions,
  roomCount,
  setRoomCount,
  selectedDateRange,
  setSelectedDateRange,
  getDateDisplayText,
  selectedCruise,
  setSelectedCruise,
  handleSearch,
}) => {
  return (
    <div className="hidden md:flex w-full gap-1 px-1 lg:py-1 justify-between items-center bg-white rounded-full border z-10 shadow-lg border-gray-300">
      <div className='w-full'>
        <div className='w-full grid grid-cols-3'>
          {/* Type Selector */}
          <div ref={typeRef} className="flex-1 min-w-0">
            <button
              onClick={() => setActiveSection(activeSection === 'type' ? null : 'type')}
              className={`w-full px-1 sm:px-4 py-5 sm:py-4 rounded-full text-left transition-colors duration-200 ${showErrors && errors.type
                ? 'border-2 border-red-500 bg-red-50'
                : 'hover:bg-blue-500 hover:text-white'
                } ${selectedType ? 'text-black font-semibold' : ''} text-black`}
            >
              <div className="flex items-center gap-1 lg:gap-2">
                {selectedType === BookingType.private
                  ? <User className={`w-4 h-4 shrink-0 ${showErrors && errors.type ? 'text-red-500' : ''}`} />
                  : <Users className={`w-4 h-4 shrink-0 ${showErrors && errors.type ? 'text-red-500' : ''}`} />}
                <div className="min-w-0 flex-1">
                  <p className={`hidden sm:block text-sm truncate ${showErrors && errors.type ? 'text-red-500 font-semibold' : ''}`}>
                    {selectedType ? getSelectedLabel(selectedType) : 'Select Type'}
                  </p>
                  <p className={`sm:hidden truncate ${showErrors && errors.type ? 'text-red-500 font-semibold' : ''}`}>
                    {selectedType ? getSelectedLabel(selectedType) : 'Type'}
                  </p>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeSection === 'type' ? 'rotate-180' : ''} ${showErrors && errors.type ? 'text-red-500' : ''}`} />
              </div>
            </button>

            {activeSection === 'type' && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-full left-0 right-0 w-fit mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-2 z-50"
              >
                {typeOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSelectedType(option.id);
                      setActiveSection('category');
                    }}
                    className={`w-full flex items-center mt-1 gap-0.5 lg:gap-3 px-4 py-3 rounded-xl transition-colors ${selectedType === option.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'hover:bg-blue-100 text-gray-900'
                      }`}
                  >
                    <span className="text-xl">{option.icon}</span>
                    <span className="font-medium text-sm">{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Category Selector */}
          <div ref={categoryRef} className="flex-1 min-w-0">
            <button
              onClick={() => setActiveSection(activeSection === 'category' ? null : 'category')}
              className={`w-full px-1 sm:px-4 py-5 sm:py-4 rounded-full text-left transition-colors duration-200 ${showErrors && errors.category
                ? 'border-2 border-red-500 bg-red-50'
                : 'hover:bg-blue-500 hover:text-white'
                } text-black font-semibold`}
            >
              <div className="flex items-center gap-1 lg:gap-2">
                <Ship className={`w-4 h-4 shrink-0 ${showErrors && errors.category ? 'text-red-500' : ''}`} />
                <div className="min-w-0 flex-1">
                  <p className={`truncate ${showErrors && errors.category ? 'text-red-500 font-semibold' : ''}`}>
                    {selectedCategory ? getCategoryLabel(selectedCategory) : 'Select category'}
                  </p>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeSection === 'category' ? 'rotate-180' : ''} ${showErrors && errors.category ? 'text-red-500' : ''}`} />
              </div>
            </button>

            {activeSection === 'category' && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-full mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-2 z-50"
              >
                {categoryOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSelectedCategory(option.id);
                      setActiveSection('date');
                    }}
                    className={`w-full flex items-center mt-1 gap-0.5 lg:gap-3 px-4 py-3 rounded-xl transition-colors ${selectedCategory === option.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'hover:bg-blue-100 text-gray-900'
                      }`}
                  >
                    <span className="font-medium text-sm">{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Selector */}
          <div ref={datesRef} className="flex-1 min-w-0">
            <button
              onClick={() => setActiveSection(activeSection === 'date' ? null : 'date')}
              className={`w-full px-1 sm:px-4 py-5 sm:py-4 text-left transition-colors duration-200 rounded-full ${showErrors && errors.date
                ? 'border-2 border-red-500 bg-red-50 text-red-500'
                : 'text-black hover:text-white hover:bg-blue-500'
                } ${selectedDateRange.startDate ? 'text-black font-semibold' : ''}`}
            >
              <div className="flex items-center gap-1 lg:gap-2">
                <Calendar className={`w-4 h-4 shrink-0 ${showErrors && errors.date ? 'text-red-500' : ''}`} />
                <div className="min-w-0 flex-1">
                  <p className={`hidden sm:block truncate ${showErrors && errors.date ? 'text-red-500 font-semibold' : ''}`}>
                    {!selectedDateRange.startDate ? 'Select Date' : getDateDisplayText()}
                  </p>
                  <p className={`sm:hidden text-sm truncate ${showErrors && errors.date ? 'text-red-500 font-semibold' : ''}`}>
                    {!selectedDateRange.startDate ? 'Date' : getDateDisplayText()}
                  </p>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeSection === 'date' ? 'rotate-180' : ''} ${showErrors && errors.date ? 'text-red-500' : ''}`} />
              </div>
            </button>

            {activeSection === 'date' && (
              <div className="absolute top-full mt-2 right-0 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 z-50 min-w-75">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-gray-700">Number of Rooms</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setRoomCount(prev => Math.max(1, prev - 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-6 text-center font-bold">{roomCount}</span>
                    <button
                      onClick={() => setRoomCount(prev => prev + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <hr className="mb-4 border-gray-100" />
                <DateSelector
                  selectedCruise={selectedCruise}
                  setSelectedCruise={setSelectedCruise}
                  selected={selectedDateRange}
                  onSelect={setSelectedDateRange}
                  onClose={() => setActiveSection(null)}
                  bookingTypeId={selectedType}
                  inline={true}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleSearch}
        className="p-3 flex items-center justify-center gap-1 rounded-full bg-blue-500 text-white hover:bg-blue-600 hover:scale-110 active:scale-95 shrink-0 transition-all duration-200"
      >
        <div className='hidden sm:block'>Search</div><Search className="w-5 h-5 sm:w-4 sm:h-4" />
      </button>
    </div>
  );
};

export default DesktopSearchBar;