import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DateSelectionProps {
  date: Date | null;
  setDate: (date: Date | null) => void;
}

const DateSelection: React.FC<DateSelectionProps> = ({ date, setDate }) => {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value;
    if (!value) {
      setDate(null);
      return;
    }
    // value is in yyyy-MM-dd format
    const next = new Date(value + 'T00:00:00');
    setDate(next);
  };

  const inputValue = date ? format(date, 'yyyy-MM-dd') : '';

  return (
      <div className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">
          Date Acquired{' '}
          <span className="text-xs text-gray-500">(optional)</span>
        </h2>
      </div>

      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
          <CalendarIcon className="h-4 w-4" />
        </span>
        <input
          type="date"
          className={cn(
                        'w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm',
            !date && 'text-muted-foreground'
          )}
          value={inputValue}
          onChange={handleChange}
        />
      </div>

      {date && (
        <p className="text-xs text-muted-foreground">
          Selected: {format(date, 'MMMM d, yyyy')}
        </p>
      )}
    </div>
  );
};

export default DateSelection;