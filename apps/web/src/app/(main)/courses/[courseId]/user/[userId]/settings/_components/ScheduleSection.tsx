"use client";

import { useState, useTransition, useMemo } from "react";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import { Slider } from "@/components/ui/shadcn/slider";
import { updateCourseSettings } from "@/app/actions/courses";
import { HiCheck, HiExclamation } from "react-icons/hi";

const DAYS = [
    { id: "monday", label: "Mon" },
    { id: "tuesday", label: "Tue" },
    { id: "wednesday", label: "Wed" },
    { id: "thursday", label: "Thu" },
    { id: "friday", label: "Fri" },
    { id: "saturday", label: "Sat" },
    { id: "sunday", label: "Sun" },
];

// Slider bounds
const MIN_MINUTES = 10;
const MAX_MINUTES = 180;
const MIN_HOURS_WEEK = 0.5;
const MAX_HOURS_WEEK = 20;

type TimeMode = "minutes" | "hours";

interface ScheduleSectionProps {
    courseId: string;
    schedule: {
        daysPerWeek: string[];
        minutesPerSession: number;
    } | null;
}

export function ScheduleSection({ courseId, schedule }: ScheduleSectionProps) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Original values for change detection (memoized to prevent re-renders)
    const originalDays = useMemo(
        () => schedule?.daysPerWeek ?? ["monday", "wednesday", "friday"],
        [schedule?.daysPerWeek]
    );
    const originalMinutes = schedule?.minutesPerSession ?? 30;

    const [selectedDays, setSelectedDays] = useState<string[]>(originalDays);
    const [minutesPerSession, setMinutesPerSession] = useState(originalMinutes);
    const [timeMode, setTimeMode] = useState<TimeMode>("minutes");

    // Calculate hours per week from minutes per session and selected days
    const hoursPerWeek = useMemo(() => {
        const numDays = selectedDays.length || 1;
        return (minutesPerSession * numDays) / 60;
    }, [minutesPerSession, selectedDays.length]);

    // Check if there are unsaved changes
    const hasChanges = useMemo(() => {
        const daysChanged =
            selectedDays.length !== originalDays.length ||
            !selectedDays.every((d) => originalDays.includes(d));
        const minutesChanged = minutesPerSession !== originalMinutes;
        return daysChanged || minutesChanged;
    }, [selectedDays, originalDays, minutesPerSession, originalMinutes]);

    const handleDayToggle = (dayId: string) => {
        setSelectedDays((prev) => {
            const newDays = prev.includes(dayId)
                ? prev.filter((d) => d !== dayId)
                : [...prev, dayId];
            // Don't allow zero days selected
            return newDays.length > 0 ? newDays : prev;
        });
        setSuccess(false);
    };

    const handleMinutesChange = (value: number) => {
        const clamped = Math.max(MIN_MINUTES, Math.min(MAX_MINUTES, value));
        setMinutesPerSession(clamped);
        setSuccess(false);
    };

    const handleHoursChange = (value: number) => {
        // Convert hours per week to minutes per session
        const numDays = selectedDays.length || 1;
        const newMinutes = Math.round((value * 60) / numDays);
        const clamped = Math.max(
            MIN_MINUTES,
            Math.min(MAX_MINUTES, newMinutes)
        );
        setMinutesPerSession(clamped);
        setSuccess(false);
    };

    const handleSliderChange = (values: number[]) => {
        if (timeMode === "minutes") {
            handleMinutesChange(values[0]);
        } else {
            handleHoursChange(values[0]);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (!isNaN(value)) {
            if (timeMode === "minutes") {
                handleMinutesChange(Math.round(value));
            } else {
                handleHoursChange(value);
            }
        }
    };

    const handleSave = () => {
        setError(null);
        setSuccess(false);
        startTransition(async () => {
            const result = await updateCourseSettings(courseId, {
                schedule: {
                    daysPerWeek: selectedDays,
                    minutesPerSession,
                },
            });
            if (result.error) {
                setError(result.error);
            } else {
                setSuccess(true);
            }
        });
    };

    // Get slider and input values based on mode
    const sliderValue =
        timeMode === "minutes" ? minutesPerSession : hoursPerWeek;
    const sliderMin = timeMode === "minutes" ? MIN_MINUTES : MIN_HOURS_WEEK;
    const sliderMax = timeMode === "minutes" ? MAX_MINUTES : MAX_HOURS_WEEK;
    const sliderStep = timeMode === "minutes" ? 5 : 0.5;
    const inputValue =
        timeMode === "minutes"
            ? minutesPerSession.toString()
            : hoursPerWeek.toFixed(1);
    const unitLabel = timeMode === "minutes" ? "min/session" : "hrs/week";

    return (
        <section className="p-6 bg-muted/50 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Study Schedule</h2>

            <div className="space-y-6">
                {/* Days selection */}
                <div>
                    <label className="text-sm font-medium text-muted-foreground mb-3 block">
                        Days per week
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {DAYS.map((day) => (
                            <button
                                key={day.id}
                                type="button"
                                onClick={() => handleDayToggle(day.id)}
                                className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                                    selectedDays.includes(day.id)
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-background border-input hover:bg-accent hover:text-accent-foreground"
                                }`}
                            >
                                {day.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Time input with toggle */}
                <div>
                    {/* Mode toggle */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-medium text-muted-foreground">
                            Time commitment
                        </span>
                        <div className="flex rounded-md border overflow-hidden ml-auto">
                            <button
                                type="button"
                                onClick={() => setTimeMode("minutes")}
                                className={`px-3 py-1 text-xs transition-colors ${
                                    timeMode === "minutes"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-background hover:bg-accent"
                                }`}
                            >
                                Per Session
                            </button>
                            <button
                                type="button"
                                onClick={() => setTimeMode("hours")}
                                className={`px-3 py-1 text-xs transition-colors ${
                                    timeMode === "hours"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-background hover:bg-accent"
                                }`}
                            >
                                Per Week
                            </button>
                        </div>
                    </div>

                    {/* Slider with input */}
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <Slider
                                value={[sliderValue]}
                                min={sliderMin}
                                max={sliderMax}
                                step={sliderStep}
                                onValueChange={handleSliderChange}
                                className="w-full"
                            />
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <Input
                                type="number"
                                value={inputValue}
                                onChange={handleInputChange}
                                className="w-20 text-center"
                                min={sliderMin}
                                max={sliderMax}
                                step={sliderStep}
                            />
                            <span className="text-sm text-muted-foreground w-20">
                                {unitLabel}
                            </span>
                        </div>
                    </div>

                    {/* Summary text */}
                    <p className="text-xs text-muted-foreground mt-2">
                        {selectedDays.length} day
                        {selectedDays.length !== 1 ? "s" : ""} ×{" "}
                        {minutesPerSession} min = {hoursPerWeek.toFixed(1)}{" "}
                        hours/week
                    </p>
                </div>

                {/* Save button */}
                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleSave}
                        disabled={isPending || !hasChanges}
                    >
                        {isPending ? "Saving..." : "Save Schedule"}
                    </Button>
                    {success && (
                        <span className="flex items-center gap-1 text-sm text-green-600">
                            <HiCheck className="h-4 w-4" />
                            Saved
                        </span>
                    )}
                    {error && (
                        <span className="flex items-center gap-1 text-sm text-destructive">
                            <HiExclamation className="h-4 w-4" />
                            {error}
                        </span>
                    )}
                </div>
            </div>
        </section>
    );
}
