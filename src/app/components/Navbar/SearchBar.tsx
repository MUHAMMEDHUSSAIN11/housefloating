import React, { useState, useRef, useEffect } from 'react';
import { Ship, Calendar, Users, ChevronDown, User, Plus, Minus, Send } from 'lucide-react';
import DateSelector from './DateSelector';
import { format } from 'date-fns';
import { BookingType, BoatCruises, Categories } from '@/app/enums/enums';
import { usePathname, useRouter } from 'next/navigation';

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

const categoryOptions = [
  { id: 'allCategory', label: 'All Category' },
  { id: Categories.Deluxe, label: Categories.Deluxe },
  { id: Categories.Premium, label: 'Premium'},
  { id: Categories.Luxury, label: 'Luxury' },
];

const typeOptions = [
  { id: BookingType.private, label: BookingType.private, icon: <User/> },
  { id: BookingType.sharing, label: BookingType.sharing, icon: <Users/> },
];

const SearchBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  
  const [selectedCruise, setSelectedCruise] = useState<BoatCruises>(BoatCruises.overNightCruise);
  const [selectedType, setSelectedType] = useState<BookingType | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>({ startDate: null, endDate: null });
  const [selectedCategory, setSelectedCategory] = useState<Categories | 'allCategory'>('allCategory');
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [roomCount, setRoomCount] = useState(1);
  const [showFilter, setShowFilter] = useState(false);

  const typeRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const datesRef = useRef<HTMLDivElement>(null);

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

    const handleScroll = () => {
      if (activeSection) {
        setActiveSection(null);
      }
      if(showFilter) {
        setShowFilter(false)
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [activeSection, showFilter]);

  const handleSearch = async () => {
    if (!selectedType || !selectedDateRange.startDate) return;

    try {
      // const params = new URLSearchParams({
      //   type: selectedType,
      //   cruise: selectedCruise,
      //   startDate: selectedDateRange.startDate.toISOString(),
      //   ...(selectedDateRange.endDate && { endDate: selectedDateRange.endDate.toISOString() }),
      //   ...(selectedCategory !== 'allCategory' && { category: selectedCategory }),
      //   rooms: roomCount.toString(),
      // });

      // const response = await fetch(`/api/boats?${params}`);
      // const data = await response.json();

      router.push(`/houseBoats`);
    } catch (error) {
      console.error('Error fetching boats:', error);
    }
  };

  const getCategoryLabel = (type: Categories | 'allCategory') => {
    const option = categoryOptions.find(o => o.id === type);
    return option ? option.label : null;
  };

  const getSelectedLabel = (type: BookingType) => {
    const option = typeOptions.find(o => o.id === type);
    return option ? option.label : null;
  };

  const getDateDisplayText = () => {
    if (!selectedDateRange.startDate) return 'Select date';
    
    if (selectedCruise === BoatCruises.overNightCruise && selectedDateRange.endDate) {
      return `${format(selectedDateRange.startDate, 'MMM d')} - ${format(selectedDateRange.endDate, 'MMM d, yyyy')}`;
    }
    
    return format(selectedDateRange.startDate, 'MMM d, yyyy');
  };

  const isSearchReady = selectedType && 
                        selectedCategory && 
                        roomCount && 
                        selectedDateRange.startDate && 
                        selectedCruise &&
                        (selectedCruise !== BoatCruises.overNightCruise || selectedDateRange.endDate);

  return (
    <div className="relative w-full my-3">
      <div className="flex w-full justify-between items-center bg-white rounded-full border z-10 shadow-lg border-gray-300">
        <div className='w-full'>
          <div className='w-full grid grid-cols-3'>
            {/* Type Selector */}
            <div ref={typeRef} className="flex-1 min-w-0">
              <button
                onClick={() => setActiveSection(activeSection === 'type' ? null : 'type')}
                className={`w-full px-1 sm:px-4 py-3 sm:py-4 rounded-full text-left transition-colors duration-200 hover:bg-blue-500 hover:text-white text-gray-500`}
              >
                <div className="flex items-center gap-1 lg:gap-2">
                  <Users className="w-2 lg:w-4 h-2 lg:h-4 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs truncate">
                      {selectedType ? getSelectedLabel(selectedType) : 'Select Type'}
                    </p>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeSection === 'type' ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {activeSection === 'type' && (
                <div className="absolute top-full left-0 right-0 w-fit mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-2 z-50">
                  {typeOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSelectedType(option.id);
                        setActiveSection(null);
                      }}
                      className={`w-full flex items-center mt-1 gap-0.5 lg:gap-3 px-4 py-3 rounded-xl transition-colors ${
                        selectedType === option.id
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
                className={`w-full px-1 sm:px-4 py-3 sm:py-4 rounded-full text-left transition-colors duration-200 hover:bg-blue-500 hover:text-white text-gray-500`}
              >
                <div className="flex items-center gap-1 lg:gap-2">
                  <Ship className="w-2 lg:w-4 h-2 lg:h-4 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs truncate">
                      {selectedCategory ? getCategoryLabel(selectedCategory) : 'Select category'}
                    </p>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeSection === 'category' ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {activeSection === 'category' && (       
                <div className="absolute top-full mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-2 z-50">
                  <div className="flex items-center justify-between gap-4 my-2">
                    <span className="text-sm text-gray-600">Rooms</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setRoomCount(Math.max(1, roomCount - 1))}
                        className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center font-medium">{roomCount}</span>
                      <button
                        onClick={() => setRoomCount(roomCount + 1)}
                        className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <hr/>
                  {categoryOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSelectedCategory(option.id as Categories | 'allCategory');
                        setActiveSection(null);
                      }}
                      className={`w-full flex items-center mt-1 gap-0.5 lg:gap-3 px-4 py-3 rounded-xl transition-colors ${
                        selectedCategory === option.id
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
                className={`w-full px-1 sm:px-4 py-3 sm:py-4 text-left transition-colors duration-200 rounded-full text-gray-500 hover:text-white hover:bg-blue-500`}
              >
                <div className="flex items-center gap-1 lg:gap-2">
                  <Calendar className="w-2 lg:w-4 h-2 lg:h-4 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs truncate">
                      {getDateDisplayText()}
                    </p>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeSection === 'date' ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {activeSection === 'date' && (
                <DateSelector
                  selectedCruise={selectedCruise}
                  setSelectedCruise={setSelectedCruise}
                  selected={selectedDateRange}
                  onSelect={setSelectedDateRange}
                  onClose={() => setActiveSection(null)}
                />
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => {handleSearch()}}
          className={`mx-2 p-2 lg:p-1.5 rounded-full bg-blue-500 text-white hover:bg-blue-600 hover:scale-110 active:scale-95 flex-shrink-0
            transition-all duration-500 ease-out
            ${isSearchReady 
              ? 'opacity-100 translate-x-0 scale-100 pointer-events-auto' 
              : 'opacity-0 translate-x-4 scale-75 pointer-events-none absolute'
            }`}
        >
          <Send className="w-2 h-2 sm:w-3 sm:h-3"/>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;