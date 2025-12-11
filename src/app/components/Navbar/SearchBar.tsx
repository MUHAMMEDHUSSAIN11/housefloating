import React, { useState, useRef, useEffect } from 'react';
import { Ship, Calendar, Users, ChevronDown, User, Plus, Minus, Home } from 'lucide-react';
import DateSelector from './DateSelector';
import { format } from 'date-fns';
import { IoChevronUp } from 'react-icons/io5';
import { BookingType, BoatCruises, Categories } from '@/app/enums/enums';
import { usePathname, useRouter } from 'next/navigation';

const cruiseOptions = [
  { id: BoatCruises.dayCruise, label: 'Day Cruise' },
  { id: BoatCruises.overNightCruise, label: 'Overnight Cruise'},
  { id: BoatCruises.nightStay, label: 'Night Stay' },
];

const categoryOptions = [
  { id: 'allCategory', label: 'All Category' },
  { id: Categories.Deluxe, label: 'Deluxe' },
  { id: Categories.Premium, label: 'Premium'},
  { id: Categories.Luxury, label: 'Luxury' },
];

const typeOptions = [
  { id: BookingType.individual, label: 'Individual', icon: <User/> },
  { id: BookingType.sharing, label: 'Sharing', icon: <Users/> },
];

const SearchBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === '/';
  
  const [selectedCruise, setSelectedCruise] = useState<BoatCruises | null>(null);
  const [selectedType, setSelectedType] = useState<BookingType | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Categories | 'allCategory'>('allCategory');
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [roomCount, setRoomCount] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [hasNavigated, setHasNavigated] = useState(false);

  const typeRef = useRef<HTMLDivElement>(null);
  const roomRef = useRef<HTMLDivElement>(null);
  const cruiseRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const datesRef = useRef<HTMLDivElement>(null);

  // Reset all selections when returning to home page
  useEffect(() => {
    if (isHomePage) {
      setSelectedCruise(null);
      setSelectedType(null);
      setSelectedDate(null);
      setSelectedCategory('allCategory');
      setRoomCount(1);
      setShowFilter(false);
      setHasNavigated(false);
    }
  }, [isHomePage]);

  // Auto-navigate when all required fields are selected on home page
  useEffect(() => {
    if (isHomePage && selectedType && selectedCruise && selectedDate && !hasNavigated) {
      setHasNavigated(true);
      handleSearch();
    }
  }, [selectedType, selectedCruise, selectedDate, isHomePage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeSection === 'type' && typeRef.current && !typeRef.current.contains(event.target as Node)) {
        setActiveSection(null);
      }
      if (activeSection === 'cruise' && cruiseRef.current && !cruiseRef.current.contains(event.target as Node)) {
        setActiveSection(null);
      }
      if (activeSection === 'category' && categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setActiveSection(null);
      }
      if (activeSection === 'rooms' && roomRef.current && !roomRef.current.contains(event.target as Node)) {
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
    if (!selectedType || !selectedCruise || !selectedDate) return;

    try {
      // const params = new URLSearchParams({
      //   type: selectedType,
      //   cruise: selectedCruise,
      //   date: selectedDate.toISOString(),
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

  const getCruiseLabel = (type: BoatCruises) => {
    const option = cruiseOptions.find(o => o.id === type);
    return option ? option.label : null;
  };

  const getCategoryLabel = (type: Categories | 'allCategory') => {
    const option = categoryOptions.find(o => o.id === type);
    return option ? option.label : null;
  };

  const getSelectedLabel = (type: BookingType) => {
    const option = typeOptions.find(o => o.id === type);
    return option ? option.label : null;
  };

  const onFilterToggle = () => {
    setShowFilter(!showFilter)
  }

  return (
    <div className="relative w-full my-3">
        <div className="flex w-full justify-between items-center bg-white rounded-full border z-10 shadow-lg border-gray-300">
        <div className='w-full'>
        <div className='w-full grid grid-cols-3'>
        {/* Type Selector */}
        <div ref={typeRef} className="flex-1 min-w-0">
          <button
            onClick={() => setActiveSection(activeSection === 'type' ? null : 'type')}
            className={`w-full px-1 sm:px-4 py-3 sm:py-4 rounded-full text-left transition-colors duration-200 hover:bg-blue-500  hover:text-white text-gray-500`}
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

        {/* Cruise Type Selector */}
        <div ref={cruiseRef} className="flex-1 min-w-0">
          <button
            onClick={() => setActiveSection(activeSection === 'cruise' ? null : 'cruise')}
            className={`w-full px-1 sm:px-4 py-3 sm:py-4 rounded-full text-left transition-colors duration-200 hover:bg-blue-500  hover:text-white text-gray-500`}
          >
            <div className="flex items-center gap-1 lg:gap-2">
              <Ship className="w-2 lg:w-4 h-2 lg:h-4 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs truncate">
                  {selectedCruise ? getCruiseLabel(selectedCruise) : 'Select Cruise'}
                </p>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${activeSection === 'cruise' ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {activeSection === 'cruise' && (
            <div className="absolute top-full mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-2 z-50">
              {cruiseOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSelectedCruise(option.id);
                    setActiveSection(null);
                  }}
                  className={`w-full flex items-center mt-1 gap-0.5 lg:gap-3 px-4 py-3 rounded-xl transition-colors ${
                    selectedCruise === option.id
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
                  {selectedDate ? format(selectedDate, 'MMM d, yyyy') : 'Select date'}
                </p>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${activeSection === 'date' ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {activeSection === 'date' && (
            <DateSelector
              selected={selectedDate}
              onSelect={setSelectedDate}
              onClose={() => setActiveSection(null)}
            />
          )}
        </div>
        </div>

        {/* Extra filters - Only show on /houseBoats page */}
        {!isHomePage && (
          <div className={`absolute w-full grid grid-cols-2 bg-white shadow-lg border rounded-full border-gray-300 ${!showFilter&&'hidden'}`}>
            {/* Rooms Selector */}
            <div ref={roomRef} className="flex-1 min-w-0">
              <button
                onClick={() => setActiveSection(activeSection === 'rooms' ? null : 'rooms')}
                className={`w-full px-1 sm:px-4 py-3 sm:py-4 rounded-full text-left transition-colors duration-200 hover:bg-blue-500  hover:text-white text-gray-500`}
              >
                <div className="flex items-center gap-1 lg:gap-2">
                  <Home className="w-2 lg:w-4 h-2 lg:h-4 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs`}>Rooms {roomCount}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeSection === 'rooms' ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {activeSection === 'rooms' && (
                <div
                  data-filter-dropdown
                  className="fixed bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-[100] min-w-[160px]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-gray-600">Rooms</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setRoomCount(Math.max(1, roomCount - 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center font-medium">{roomCount}</span>
                      <button
                        onClick={() => setRoomCount(roomCount + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Category Selector */}
            <div ref={categoryRef} className="flex-1 min-w-0">
              <button
                onClick={() => setActiveSection(activeSection === 'category' ? null : 'category')}
                className={`w-full px-1 sm:px-4 py-3 sm:py-4 rounded-full text-left transition-colors duration-200 hover:bg-blue-500  hover:text-white text-gray-500`}
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
          </div>
        )}
        </div>

        {/* Filter toggle button - Only show on /houseBoats page */}
        {!isHomePage && (
          <button
            onClick={onFilterToggle}
            className="mx-2 p-2 lg:p-1.5 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors flex-shrink-0"
          >
            <IoChevronUp className={`w-2 h-2 sm:w-3 sm:h-3 ${showFilter?'':'rotate-180'}`}/>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;