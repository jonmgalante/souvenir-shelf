// src/components/trips/AddTrip.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { Calendar } from "../ui/calendar";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      // Should not happen if Layout is gating routes, but guard anyway
      console.error("Cannot create trip: no authenticated user");
      return;
    }

    if (!name.trim() || !startDate || !endDate) {
      // You can swap this for a toast if you prefer
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
      // Optionally show a toast here
    } finally {
      setSubmitting(false);
    }
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Start date */}
            <div className="space-y-2">
              <span className="block text-sm font-medium">
                Start Date
              </span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, "MMMM d, yyyy")
                    ) : (
                      <span>Select a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate ?? undefined}
                    onSelect={(date) => setStartDate(date ?? null)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End date */}
            <div className="space-y-2">
              <span className="block text-sm font-medium">
                End Date
              </span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? (
                      format(endDate, "MMMM d, yyyy")
                    ) : (
                      <span>Select a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate ?? undefined}
                    onSelect={(date) => setEndDate(date ?? null)}
                    initialFocus
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