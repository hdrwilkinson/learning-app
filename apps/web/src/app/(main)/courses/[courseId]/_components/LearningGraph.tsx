/**
 * LearningGraph
 *
 * Displays a line chart showing mastery percentage and completion percentage
 * over time with time range selection and future projections.
 */

"use client";

import { useState, useMemo } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";
import { format, subDays, addDays } from "date-fns";

export interface LearningDataPoint {
    /** Date string in ISO format */
    date: string;
    /** Mastery percentage (0-100) */
    masteryPercent: number;
    /** Completion percentage (0-100) */
    completionPercent: number;
}

type TimeRange = "week" | "month" | "all";

interface LearningGraphProps {
    /** Historical learning data points */
    data: LearningDataPoint[];
}

type MetricType = "mastery" | "completion";

export function LearningGraph({ data }: LearningGraphProps) {
    const [timeRange, setTimeRange] = useState<TimeRange>("week");
    const [metric, setMetric] = useState<MetricType>("mastery");

    // Filter data based on time range
    const filteredData = useMemo(() => {
        const now = new Date();
        let cutoffDate: Date;

        switch (timeRange) {
            case "week":
                cutoffDate = subDays(now, 7);
                break;
            case "month":
                cutoffDate = subDays(now, 30);
                break;
            case "all":
            default:
                cutoffDate = new Date(0); // Beginning of time
        }

        return data.filter((point) => new Date(point.date) >= cutoffDate);
    }, [data, timeRange]);

    // Calculate projections for tomorrow
    const projectedData = useMemo(() => {
        if (filteredData.length < 2) return filteredData;

        const lastPoint = filteredData[filteredData.length - 1];
        const secondLastPoint = filteredData[filteredData.length - 2];

        // Calculate daily improvement rate
        const masteryRate =
            lastPoint.masteryPercent - secondLastPoint.masteryPercent;
        const completionRate =
            lastPoint.completionPercent - secondLastPoint.completionPercent;

        // Create tomorrow's date
        const tomorrow = addDays(new Date(lastPoint.date), 1);
        const tomorrowStr = tomorrow.toISOString();

        // Project "if you study" - continue improvement
        const studyProjection: LearningDataPoint & {
            isProjection?: boolean;
            projectionType?: string;
        } = {
            date: tomorrowStr,
            masteryPercent: Math.min(
                100,
                lastPoint.masteryPercent + Math.max(masteryRate, 2)
            ),
            completionPercent: Math.min(
                100,
                lastPoint.completionPercent + Math.max(completionRate, 1.5)
            ),
            isProjection: true,
            projectionType: "study",
        };

        // Project "if you don't study" - slight decay
        const noStudyProjection: LearningDataPoint & {
            isProjection?: boolean;
            projectionType?: string;
        } = {
            date: tomorrowStr,
            masteryPercent: Math.max(0, lastPoint.masteryPercent - 1.5),
            completionPercent: lastPoint.completionPercent, // Completion doesn't decay
            isProjection: true,
            projectionType: "noStudy",
        };

        return {
            historical: filteredData,
            studyProjection,
            noStudyProjection,
            lastPoint,
        };
    }, [filteredData]);

    // Format data for display with projections
    const chartData = useMemo(() => {
        if (!("historical" in projectedData)) {
            return filteredData.map((point) => ({
                ...point,
                displayDate: format(new Date(point.date), "MMM d"),
            }));
        }

        const { historical, studyProjection, noStudyProjection, lastPoint } =
            projectedData;

        // Add historical data (all but the last point)
        const formatted = historical.slice(0, -1).map((point) => ({
            ...point,
            displayDate: format(new Date(point.date), "MMM d"),
            masteryIfStudy: null as number | null,
            completionIfStudy: null as number | null,
            masteryIfNoStudy: null as number | null,
        }));

        // Add "today" point - this is where the line branches
        // Purple line ends here, green/red lines start here
        formatted.push({
            date: lastPoint.date,
            displayDate: format(new Date(lastPoint.date), "MMM d"),
            masteryPercent: lastPoint.masteryPercent,
            completionPercent: lastPoint.completionPercent,
            // Start projection lines from today's value
            masteryIfStudy: lastPoint.masteryPercent,
            completionIfStudy: lastPoint.completionPercent,
            masteryIfNoStudy: lastPoint.masteryPercent,
        });

        // Add "tomorrow" projection point - only projection values, no main line
        formatted.push({
            date: studyProjection.date,
            displayDate: format(new Date(studyProjection.date), "MMM d"),
            masteryPercent: null as unknown as number, // Don't continue purple line
            completionPercent: null as unknown as number,
            masteryIfStudy: studyProjection.masteryPercent,
            completionIfStudy: studyProjection.completionPercent,
            masteryIfNoStudy: noStudyProjection.masteryPercent,
        });

        return formatted;
    }, [projectedData, filteredData]);

    // Calculate Y-axis domain based on data for zoomed view
    const yDomain = useMemo(() => {
        if (timeRange === "all") return [0, 100];

        // Include historical data for the selected metric
        const historicalValues = filteredData.map((d) =>
            metric === "mastery" ? d.masteryPercent : d.completionPercent
        );

        // Also include projection values if available (only for mastery)
        const projectionValues: number[] = [];
        if (metric === "mastery" && "historical" in projectedData) {
            const { studyProjection, noStudyProjection } = projectedData;
            projectionValues.push(
                studyProjection.masteryPercent,
                noStudyProjection.masteryPercent
            );
        }

        const allValues = [...historicalValues, ...projectionValues];
        if (allValues.length === 0) return [0, 100];

        const min = Math.min(...allValues);
        const max = Math.max(...allValues);

        // Tight bounds - just 1% padding, rounded to nearest integer
        const domainMin = Math.max(0, Math.floor(min - 1));
        const domainMax = Math.min(100, Math.ceil(max + 1));

        return [domainMin, domainMax];
    }, [filteredData, timeRange, metric, projectedData]);

    const timeRangeButtons: { value: TimeRange; label: string }[] = [
        { value: "week", label: "Week" },
        { value: "month", label: "Month" },
        { value: "all", label: "All Time" },
    ];

    return (
        <div className="w-full rounded-xl border border-border bg-card p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                    <h3 className="font-display text-sm font-semibold text-foreground">
                        Learning Progress
                    </h3>

                    {/* Metric toggle */}
                    <div className="flex gap-1 rounded-lg bg-muted p-1">
                        <button
                            onClick={() => setMetric("mastery")}
                            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                                metric === "mastery"
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            Mastery
                        </button>
                        <button
                            onClick={() => setMetric("completion")}
                            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                                metric === "completion"
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            Completion
                        </button>
                    </div>
                </div>

                {/* Time range selector */}
                <div className="flex gap-1 rounded-lg bg-muted p-1">
                    {timeRangeButtons.map((btn) => (
                        <button
                            key={btn.value}
                            onClick={() => setTimeRange(btn.value)}
                            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                                timeRange === btn.value
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="hsl(var(--border))"
                            opacity={0.5}
                        />
                        <XAxis
                            dataKey="displayDate"
                            tick={{
                                fill: "hsl(var(--muted-foreground))",
                                fontSize: 12,
                            }}
                            tickLine={{ stroke: "hsl(var(--border))" }}
                            axisLine={{ stroke: "hsl(var(--border))" }}
                        />
                        <YAxis
                            domain={yDomain}
                            tick={{
                                fill: "hsl(var(--muted-foreground))",
                                fontSize: 12,
                            }}
                            tickLine={{ stroke: "hsl(var(--border))" }}
                            axisLine={{ stroke: "hsl(var(--border))" }}
                            tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "hsl(var(--popover))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px",
                                color: "hsl(var(--popover-foreground))",
                                fontSize: "12px",
                                padding: "8px 12px",
                            }}
                            labelStyle={{
                                color: "hsl(var(--foreground))",
                                fontSize: "12px",
                                fontWeight: 500,
                                marginBottom: "4px",
                            }}
                            itemStyle={{
                                fontSize: "12px",
                                padding: "2px 0",
                            }}
                            isAnimationActive={false}
                            formatter={(value, name) => {
                                const numValue =
                                    typeof value === "number" ? value : 0;
                                const labels: Record<string, string> = {
                                    masteryPercent: "Mastery",
                                    completionPercent: "Completion",
                                    masteryIfStudy: "If you study",
                                    completionIfStudy: "If you study",
                                    masteryIfNoStudy: "If you don't",
                                };
                                const label =
                                    labels[name as string] || String(name);
                                return [`${numValue.toFixed(1)}%`, label];
                            }}
                            labelFormatter={(label) => String(label)}
                        />

                        {/* Reference line for "today" */}
                        {chartData.length > 1 && (
                            <ReferenceLine
                                x={chartData[chartData.length - 2]?.displayDate}
                                stroke="hsl(var(--muted-foreground))"
                                strokeDasharray="5 5"
                                opacity={0.5}
                            />
                        )}

                        {/* Mastery line - Primary purple (stops at today) */}
                        {metric === "mastery" && (
                            <Line
                                type="monotone"
                                dataKey="masteryPercent"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                dot={{
                                    fill: "hsl(var(--primary))",
                                    strokeWidth: 0,
                                    r: 3,
                                }}
                                activeDot={{
                                    r: 5,
                                    fill: "hsl(var(--primary))",
                                }}
                                connectNulls={false}
                            />
                        )}

                        {/* Completion line - Secondary blue */}
                        {metric === "completion" && (
                            <Line
                                type="monotone"
                                dataKey="completionPercent"
                                stroke="hsl(var(--secondary))"
                                strokeWidth={2}
                                dot={{
                                    fill: "hsl(var(--secondary))",
                                    strokeWidth: 0,
                                    r: 3,
                                }}
                                activeDot={{
                                    r: 5,
                                    fill: "hsl(var(--secondary))",
                                }}
                                connectNulls={false}
                            />
                        )}

                        {/* Projection: If you study - dashed green (only for mastery) */}
                        {metric === "mastery" && (
                            <Line
                                type="monotone"
                                dataKey="masteryIfStudy"
                                stroke="hsl(var(--chart-1))"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                dot={(props) => {
                                    // Only show dot on the final projection point
                                    if (
                                        props.index === chartData.length - 1 &&
                                        props.value !== null
                                    ) {
                                        return (
                                            <circle
                                                cx={props.cx}
                                                cy={props.cy}
                                                r={5}
                                                fill="hsl(var(--chart-1))"
                                            />
                                        );
                                    }
                                    return <></>;
                                }}
                                connectNulls
                            />
                        )}

                        {/* Projection: If you don't study - dashed red (only for mastery) */}
                        {metric === "mastery" && (
                            <Line
                                type="monotone"
                                dataKey="masteryIfNoStudy"
                                stroke="hsl(var(--destructive))"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                dot={(props) => {
                                    // Only show dot on the final projection point
                                    if (
                                        props.index === chartData.length - 1 &&
                                        props.value !== null
                                    ) {
                                        return (
                                            <circle
                                                cx={props.cx}
                                                cy={props.cy}
                                                r={5}
                                                fill="hsl(var(--destructive))"
                                            />
                                        );
                                    }
                                    return <></>;
                                }}
                                connectNulls
                            />
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
