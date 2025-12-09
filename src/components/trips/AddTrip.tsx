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
              <label className="block text-sm font-medium" htmlFor="trip-start">
                Start Date
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                  <CalendarIcon className="h-4 w-4" />
                </span>
                <input
                  id="trip-start"
                  type="date"
                  className={cn(
                    'w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm',
                    !startDate && 'text-muted-foreground'
                  )}
                  value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!value) {
                      setStartDate(null);
                      return;
                    }
                    const next = new Date(value + 'T00:00:00');
                    setStartDate(next);
                  }}
                />
              </div>
            </div>

            {/* End date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium" htmlFor="trip-end">
                End Date
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                  <CalendarIcon className="h-4 w-4" />
                </span>
                <input
                  id="trip-end"
                  type="date"
                  className={cn(
                    'w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm',
                    !endDate && 'text-muted-foreground'
                  )}
                  value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!value) {
                      setEndDate(null);
                      return;
                    }
                    const next = new Date(value + 'T00:00:00');
                    setEndDate(next);
                  }}
                />
              </div>
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