import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Check } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isBefore, startOfDay, isAfter, differenceInDays } from 'date-fns';
import { BoatCruises, BoatCruisesId } from '@/app/enums/enums';

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
}

const DateSelector: React.FC<DateSelectorProps> = ({
  selected,
  onSelect,
  onClose,
  selectedCruise,
  setSelectedCruise,
  inline = false
}) => {
  const [tempStartDate, setTempStartDate] = useState<Date | null>(selected.startDate);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(selected.endDate);

  const today = startOfDay(new Date());
  const monthsToShow = Array.from({ length: 12 }, (_, i) => addMonths(startOfMonth(new Date()), i));

  const handleDateClick = (day: Date) => {
    if (isBefore(day, today)) return;

    if (selectedCruise === BoatCruisesId.dayCruise || selectedCruise === BoatCruisesId.nightStay || selectedCruise === BoatCruisesId.overNightCruise) {
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

  // handleConfirm removed as it is no longer used

  // getDayCount removed as it is no longer used

  const isDateInRange = (day: Date): boolean => {
    if (!tempStartDate) return false;

    // Simplified logic: Range selection removed for Overnight Cruise
    return isSameDay(day, tempStartDate);
  };

  const isDateSelected = (day: Date): boolean => {
    // Simplified logic: Range selection removed for Overnight Cruise
    return tempStartDate ? isSameDay(day, tempStartDate) : false;
  };

  // dayCount and canConfirm removed as they are no longer used

  return (
    <div className={`${inline ? 'relative w-full shadow-none border-none z-40' : 'absolute top-full mt-2 right-0 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 w-full sm:w-[400px] z-50'}`}>
      {/* Cruise Type Selection */}
      <div className="flex justify-between items-center my-2 w-full">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="radio"
            className="form-radio h-3 w-3 text-blue-600"
            checked={selectedCruise === BoatCruisesId.dayCruise}
            onChange={() => handleCruiseChange(BoatCruisesId.dayCruise)}
          />
          <span className="ml-1 text-xs">{BoatCruises.dayCruise}</span>
        </label>

        <label className="inline-flex items-center cursor-pointer">
          <input
            type="radio"
            className="form-radio h-3 w-3 text-blue-600"
            checked={selectedCruise === BoatCruisesId.overNightCruise}
            onChange={() => handleCruiseChange(BoatCruisesId.overNightCruise)}
          />
          <span className="ml-1 text-xs">{BoatCruises.overNightCruise}</span>
        </label>

        <label className="inline-flex items-center cursor-pointer">
          <input
            type="radio"
            className="form-radio h-3 w-3 text-blue-600"
            checked={selectedCruise === BoatCruisesId.nightStay}
            onChange={() => handleCruiseChange(BoatCruisesId.nightStay)}
          />
          <span className="ml-1 text-xs">{BoatCruises.nightStay}</span>
        </label>
      </div>

      <hr className="my-2" />

      {/* Scrollable Month List */}
      <div className={`${inline ? 'max-h-[270px]' : 'max-h-[380px]'} overflow-y-auto pr-2 custom-scrollbar`}>
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
                  <div key={day} className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {day}
                  </div>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before the start of the month */}
                {Array.from({ length: startDay }).map((_, index) => (
                  <div key={`empty-${month.toISOString()}-${index}`} className="h-10" />
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