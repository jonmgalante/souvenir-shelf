
import React from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface DateSelectionProps {
  date: Date | null;
  setShowDatePicker: React.Dispatch<React.SetStateAction<boolean>>;
  showDatePicker: boolean;
}

const DateSelection: React.FC<DateSelectionProps> = ({
  date,
  setShowDatePicker,
  showDatePicker
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Date Acquired</h2>
        <button
          type="button"
          onClick={() => setShowDatePicker(!showDatePicker)}
          className="flex items-center gap-1 text-sm font-medium text-primary"
        >
          <Calendar className="h-4 w-4" />
          <span>Pick Date</span>
        </button>
      </div>
      
      {date ? (
        <div className="p-3 bg-gray-50 rounded-lg">
          <span>{format(date, 'MMMM d, yyyy')}</span>
        </div>
      ) : (
        <div
          onClick={() => setShowDatePicker(true)}
          className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer"
        >
          <Calendar className="h-6 w-6 text-gray-400 mb-1" />
          <p className="text-sm text-gray-500">When did you get this?</p>
        </div>
      )}
    </div>
  );
};

export default DateSelection;
