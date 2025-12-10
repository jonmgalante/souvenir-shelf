// src/components/trips/AddTrip.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Calendar } from "../ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { cn } from "@/lib/utils";

import { useAuth } from "@/context/auth";
import { useSouvenirs } from "@/context/souvenir";

const AddTrip: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addTrip } = useSouvenirs();

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [submitting, setSubmitting] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      console.error("Cannot create trip: no authenticated user");
      return;
    }

    if (!name.trim() || !startDate || !endDate) {
      console.warn("Trip name and dates are required");
      return;
    }

    try {
      setSubmitting(true);

      // Use context-level addTrip so SouvenirContext's trips stay in sync
      await addTrip({
        name: name.trim(),
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
        coverImage: null,
      });

      // After creation, go back to the Trips list
      navigate("/trips");
    } catch (err) {
      console.error("Error creating trip:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartSelect = (selected: Date | undefined) => {
    if (!selected) {
      setStartDate(null);
      return;
    }
    setStartDate(selected);
    setStartOpen(false);
  };

  const handleEndSelect = (selected: Date | undefined) => {
    if (!selected) {
      setEndDate(null);
      return;
    }
    setEndDate(selected);
    setEndOpen(false);
  };

  return (
    <div className="max-w-xl mx-auto px-4 pt-8 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium">Create Trip</h1>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm text-muted-foreground"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Trip name */}
        <div className="space-y-2">
          <label
            htmlFor="trip-name"
            className="block text-sm font-medium"
          >
            Trip Name
          </label>
          <Input
            id="trip-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Italy 2024, Japan Winter, etc."
          />
        </div>

        {/* Date range */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Dates</h2>

          <div className="space-y-4">
            {/* Start date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium" htmlFor="trip-start">
                Start Date
              </label>
              <Popover open={startOpen} onOpenChange={setStartOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full max-w-sm justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, "MMMM d, yyyy")
                    ) : (
                      <span>Select a start date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate ?? undefined}
                    onSelect={handleStartSelect}
                    initialFocus
                    captionLayout="dropdown-buttons"
                    fromYear={1950}
                    toYear={new Date().getFullYear() + 5}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium" htmlFor="trip-end">
                End Date
              </label>
              <Popover open={endOpen} onOpenChange={setEndOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full max-w-sm justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? (
                      format(endDate, "MMMM d, yyyy")
                    ) : (
                      <span>Select an end date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate ?? undefined}
                    onSelect={handleEndSelect}
                    initialFocus
                    captionLayout="dropdown-buttons"
                    fromYear={1950}
                    toYear={new Date().getFullYear() + 5}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <Button
            type="submit"
            className="w-full py-6 text-lg flex items-center justify-center gap-2"
            disabled={submitting || !name.trim() || !startDate || !endDate}
          >
            {submitting ? "Creating trip..." : "Create Trip"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddTrip;