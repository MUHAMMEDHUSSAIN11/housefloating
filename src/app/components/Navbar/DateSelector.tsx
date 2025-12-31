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
  const [tempStartDate, setTempStartDate] = useState<Date | null>(selected.startDate);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(selected.endDate);

  const today = startOfDay(new Date());
  const monthsToShow = Array.from({ length: 12 }, (_, i) => addMonths(startOfMonth(new Date()), i));

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
    <div className="absolute top-full mt-2 right-0 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 z-50 w-full sm:w-[400px]">
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
      <div className="max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
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

      {/* Action Buttons - Only for Overnight Cruise */}
      {selectedCruise === BoatCruisesId.overNightCruise && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
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
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${canConfirm
              ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md'
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