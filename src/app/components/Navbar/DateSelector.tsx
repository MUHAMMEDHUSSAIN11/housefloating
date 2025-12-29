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
}

const DateSelector: React.FC<DateSelectorProps> = ({ 
  selected, 
  onSelect, 
  onClose, 
  selectedCruise, 
  setSelectedCruise 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tempStartDate, setTempStartDate] = useState<Date | null>(selected.startDate);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(selected.endDate);

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const startDay = startOfMonth(currentMonth).getDay();
  const today = startOfDay(new Date());

  const handleDateClick = (day: Date) => {
    if (isBefore(day, today)) return;

    if (selectedCruise === BoatCruisesId.dayCruise || selectedCruise === BoatCruisesId.nightStay) {
      setTempStartDate(day);
      setTempEndDate(null);
      onSelect({ startDate: day, endDate: null });
      onClose();
      return;
    }

    if (selectedCruise === BoatCruisesId.overNightCruise) {
      if (!tempStartDate || (tempStartDate && tempEndDate)) {
        setTempStartDate(day);
        setTempEndDate(null);
        return;
      }

      let start: Date;
      let end: Date;

      if (isBefore(day, tempStartDate)) {
        start = day;
        end = tempStartDate;
      } else {
        start = tempStartDate;
        end = day;
      }
      if (isSameDay(start, end)) {
        return;
      }

      setTempStartDate(start);
      setTempEndDate(end);
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

  const handleConfirm = () => {
    if (tempStartDate) {
      onSelect({ startDate: tempStartDate, endDate: tempEndDate });
      onClose();
    }
  };

  const getDayCount = (): number => {
    if (selectedCruise === BoatCruisesId.dayCruise || selectedCruise === BoatCruisesId.nightStay) {
      return tempStartDate ? 1 : 0;
    }
    
    if (tempStartDate && tempEndDate) {
      return differenceInDays(tempEndDate, tempStartDate) + 1;
    }
    
    return 0;
  };

  const isDateInRange = (day: Date): boolean => {
    if (!tempStartDate) return false;
    
    if (selectedCruise === BoatCruisesId.overNightCruise && tempEndDate) {
      return (
        (isAfter(day, tempStartDate) && isBefore(day, tempEndDate)) ||
        isSameDay(day, tempStartDate) ||
        isSameDay(day, tempEndDate)
      );
    }
    
    return isSameDay(day, tempStartDate);
  };

  const isDateSelected = (day: Date): boolean => {
    if (selectedCruise === BoatCruisesId.overNightCruise) {
      return Boolean(
        (tempStartDate && isSameDay(day, tempStartDate)) ||
        (tempEndDate && isSameDay(day, tempEndDate))
      );
    }
    return tempStartDate ? isSameDay(day, tempStartDate) : false;
  };

  const dayCount = getDayCount();
  const canConfirm = selectedCruise === BoatCruisesId.overNightCruise 
    ? Boolean(tempStartDate && tempEndDate)
    : Boolean(tempStartDate);

  return (
    <div className="absolute top-full mt-2 right-0 bg-white rounded-2xl shadow-lg border border-gray-200 p-4 z-50 w-full sm:w-96">
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
      
      <hr className="my-2"/>

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 hover:bg-blue-500 text-blue-500 hover:text-white rounded-full transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-semibold text-gray-900">
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 hover:bg-blue-500 text-blue-500 hover:text-white rounded-full transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before the start of the month */}
        {Array.from({ length: startDay }).map((_, index) => (
          <div key={`empty-${index}`} className="h-9" />
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
                h-12 w-12 rounded-full text-sm font-medium transition-colors
                ${isSelected 
                  ? 'bg-blue-500 text-white' 
                  : inRange && !isSelected
                    ? 'bg-blue-200 text-blue-700'
                    : isTodayDate 
                      ? 'bg-blue-50 text-blue-500' 
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

      {/* Action Buttons - Only for Overnight Cruise */}
      {selectedCruise === BoatCruisesId.overNightCruise && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleClear}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4" />
            <span className="text-sm font-medium">Clear</span>
          </button>
          
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              canConfirm
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">
              Confirm {dayCount > 0 && `(${dayCount}d)`}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DateSelector;