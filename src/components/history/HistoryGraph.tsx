import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { Session } from "@/types";
import { useMemo } from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

interface HistoryGraphProps {
  sessions: Session[];
}

const chartConfig = {
  duration: {
    label: "Duration",
    color: "var(--muted-foreground)",
  },
  count: {
    label: "Sessions",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDurationMinutes(ms: number): string {
  const minutes = Math.round(ms / 60000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function HistoryGraph({ sessions }: HistoryGraphProps) {
  const chartData = useMemo(() => {
    if (sessions.length === 0) return [];

    // Group sessions by day
    const dailyMap = new Map<
      string,
      { totalMs: number; count: number; date: number }
    >();

    sessions.forEach((session) => {
      const date = new Date(session.createdAt);
      date.setHours(0, 0, 0, 0);
      const key = date.toISOString();

      const existing = dailyMap.get(key);
      if (existing) {
        existing.totalMs += session.durationMs;
        existing.count += 1;
      } else {
        dailyMap.set(key, {
          totalMs: session.durationMs,
          count: 1,
          date: date.getTime(),
        });
      }
    });

    // Convert to array and sort by date (oldest first for chart)
    return Array.from(dailyMap.values())
      .sort((a, b) => a.date - b.date)
      .slice(-14) // Last 14 days
      .map((day) => ({
        date: formatDate(day.date),
        duration: Math.round(day.totalMs / 60000), // Convert to minutes
        count: day.count,
        rawMs: day.totalMs,
      }));
  }, [sessions]);

  if (sessions.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">No sessions yet.</p>
    );
  }

  if (chartData.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">
        Not enough data to display.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground text-center">
        Total duration per day (last 14 days)
      </div>
      <ChartContainer config={chartConfig} className="h-[65vh] w-full">
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
        >
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10 }}
            tickMargin={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10 }}
            tickFormatter={(value) => `${value}m`}
            width={35}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(_value, _name, item) => (
                  <div className="flex flex-col gap-1">
                    <span>
                      {formatDurationMinutes(item.payload.rawMs)} total
                    </span>
                    <span className="text-muted-foreground">
                      {item.payload.count} session
                      {item.payload.count !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              />
            }
          />
          <Bar
            dataKey="duration"
            fill="var(--color-duration)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
