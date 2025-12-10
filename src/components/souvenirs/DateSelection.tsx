// src/components/souvenirs/DateSelection.tsx

import React, { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';

interface DateSelectionProps {
  date: Date | null;
  setDate: (date: Date | null) => void;
}

const DateSelection: React.FC<DateSelectionProps> = ({ date, setDate }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (selected: Date | undefined) => {
    if (!selected) {
      setDate(null);
      return;
    }

    setDate(selected);
    setOpen(false); // close calendar once a date is chosen
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">
          Date Acquired{' '}
          <span className="text-xs text-gray-500">(optional)</span>
        </h2>
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date, 'MMMM d, yyyy')
            ) : (
              <span>When did you get this?</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date ?? undefined}
            onSelect={handleSelect}
            initialFocus
            // This gives you the Month / Year dropdowns you liked
            captionLayout="dropdown-buttons"
            fromYear={1950}
            toYear={new Date().getFullYear() + 5}
          />
        </PopoverContent>
      </Popover>

      {date && (
        <p className="text-xs text-muted-foreground">
          Selected: {format(date, 'MMMM d, yyyy')}
        </p>
      )}
    </div>
  );
};

export default DateSelection;