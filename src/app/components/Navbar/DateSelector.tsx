import { useState } from 'react';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isBefore, startOfDay } from 'date-fns';
import { BoatCruises, BoatCruisesId, BookingType } from '@/app/enums/enums';
import GetCheckInOutTimes from '../Misc/GetCheckInOutTimes';

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface DateSelectorProps {
  selected: DateRange;
  selectedCruise: BoatCruisesId;
  setSelectedCruise: React.Dispatch<React.SetStateAction<BoatCruisesId>>;
  onSelect: (dateRange: DateRange) => void;
  onClose: () => void;
  inline?: boolean;
  bookingTypeId?: BookingType | null;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  selected,
  onSelect,
  onClose,
  selectedCruise,
  setSelectedCruise,
  inline = false,
  bookingTypeId = null
}) => {
  const [tempStartDate, setTempStartDate] = useState<Date | null>(selected.startDate);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(selected.endDate);

  const today = startOfDay(new Date());
  const monthsToShow = Array.from({ length: 12 }, (_, i) => addMonths(startOfMonth(new Date()), i));

  const handleDateClick = (day: Date) => {
    if (isBefore(day, today)) return;

    if (selectedCruise === BoatCruisesId.dayCruise || selectedCruise === BoatCruisesId.nightStay || selectedCruise === BoatCruisesId.dayNight) {
      setTempStartDate(day);
      setTempEndDate(null);
      onSelect({ startDate: day, endDate: null });
      onClose();
      return;
    }
  };

  const handleCruiseChange = (cruise: BoatCruisesId) => {
    setSelectedCruise(cruise);
    setTempStartDate(null);
    setTempEndDate(null);
  };

  const handleClear = () => {
    setTempStartDate(null);
    setTempEndDate(null);
  };

  const isDateInRange = (day: Date): boolean => {
    if (!tempStartDate) return false;
    return isSameDay(day, tempStartDate);
  };

  const isDateSelected = (day: Date): boolean => {
    return tempStartDate ? isSameDay(day, tempStartDate) : false;
  };

  // Get check-in/out times for each cruise type
  // If no booking type selected, default to Private times
  const effectiveBookingType = bookingTypeId ?? BookingType.private;

  const cruiseOptions = [
    { id: BoatCruisesId.dayCruise, label: BoatCruises.dayCruise },
    { id: BoatCruisesId.dayNight, label: BoatCruises.dayNight },
    { id: BoatCruisesId.nightStay, label: BoatCruises.nightStay },
  ];

  return (
    <div className={`${inline ? 'relative w-full shadow-none border-none z-40' : 'absolute top-full mt-2 right-0 bg-white rounded-2xl shadow-2xl border border-gray-200 p-3 sm:p-4 w-full sm:min-w-[420] z-50'}`}>
      {/* Cruise Type Selection with Check-in/Out Times */}
      <div className="flex justify-between items-start my-2 w-full gap-1">
        {cruiseOptions.map((cruise) => {
          const times = GetCheckInOutTimes(cruise.id, effectiveBookingType);
          const isSelected = selectedCruise === cruise.id;

          return (
            <label
              key={cruise.id}
              className={`flex flex-col items-center cursor-pointer group flex-1 rounded-xl px-1 py-2 transition-all duration-200 ${isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'
                }`}
              onClick={() => handleCruiseChange(cruise.id)}
            >
              <div className="flex items-center gap-1">
                <input
                  type="radio"
                  className="w-3.5 h-3.5 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                  checked={isSelected}
                  onChange={() => handleCruiseChange(cruise.id)}
                />
                <span className={`text-[10px] sm:text-xs font-semibold transition-colors ${isSelected ? 'text-blue-600' : 'text-gray-700 group-hover:text-blue-600'
                  }`}>
                  {cruise.label}
                </span>
              </div>
              <div className={`mt-1 text-[9px] sm:text-[10px] leading-tight text-center ${isSelected ? 'text-blue-500' : 'text-gray-400'
                }`}>
                <div>{times.checkIn} - {times.checkOut}</div>
              </div>
            </label>
          );
        })}
      </div>

      <hr className="my-2 border border-gray-300" />

      {/* Scrollable Month List */}
      <div className={`${inline ? 'max-h-[270]' : 'max-h-[380]'} overflow-y-auto pr-2 custom-scrollbar`}>
        {monthsToShow.map((month, monthIdx) => {
          const days = eachDayOfInterval({
            start: startOfMonth(month),
            end: endOfMonth(month),
          });
          const startDay = startOfMonth(month).getDay();

          return (
            <div key={month.toISOString()} className={monthIdx > 0 ? 'mt-1' : ''}>
              <h3 className="font-semibold text-gray-900 mb-2 px-2">
                {format(month, 'MMMM yyyy')}
              </h3>

              {/* Weekday headers */}
              <div className="grid grid-cols-7 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <div key={day} className="text-center text-[10 font-bold text-gray-400 uppercase tracking-widest">
                    {day}
                  </div>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before the start of the month */}
                {Array.from({ length: startDay }).map((_, index) => (
                  <div key={`empty-${month.toISOString()}-${index}`} className="h-10 w-10 md:h-12 md:w-12" />
                ))}

                {days.map((day) => {
                  const isSelected = isDateSelected(day);
                  const isPast = isBefore(day, today);
                  const isTodayDate = isToday(day);
                  const inRange = isDateInRange(day);

                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => handleDateClick(day)}
                      disabled={isPast}
                      className={`
                        h-10 w-10 md:h-12 md:w-12 rounded-full text-sm font-medium transition-all duration-200 flex items-center justify-center
                        ${isSelected
                          ? 'bg-blue-500 text-white shadow-md'
                          : inRange && !isSelected
                            ? 'bg-blue-100 text-blue-700'
                            : isTodayDate
                              ? 'bg-blue-50 text-blue-500 ring-1 ring-blue-500 ring-inset'
                              : isPast
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-900 hover:bg-blue-100 hover:text-blue-600'
                        }
                      `}
                    >
                      {format(day, 'd')}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons removed as they are no longer needed for single date selection */}
    </div>
  );
};

export default DateSelector;