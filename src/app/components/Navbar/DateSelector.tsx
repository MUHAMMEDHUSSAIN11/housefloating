import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isBefore, startOfDay } from 'date-fns';

interface DateSelectorProps {
  selected: Date | null;
  onSelect: (date: Date | null) => void;
  onClose: () => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ selected, onSelect, onClose }) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const startDay = startOfMonth(currentMonth).getDay();
  const today = startOfDay(new Date());

  const handleDateClick = (day: Date) => {
    if (!isBefore(day, today)) {
      onSelect(day);
      onClose();
    }
  };

  return (
    <div
      className="absolute top-full mt-2 right-0 bg-white rounded-2xl shadow-lg border border-gray-200 p-4 z-50 w-full sm:w-80"
    >
      {/* Header */}
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
          const isSelected = selected && isSameDay(day, selected);
          const isPast = isBefore(day, today);
          const isTodayDate = isToday(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => handleDateClick(day)}
              disabled={isPast}
              className={`
                h-9 w-full rounded-full text-sm font-medium transition-colors
                ${isSelected 
                  ? 'bg-blue-500 text-white' 
                  : isTodayDate 
                    ? 'bg-blue-100 text-blue-500' 
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
};

export default DateSelector;