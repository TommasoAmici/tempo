"use client";

import type { URLFilters } from "@/hooks/url";
import { useHeatmap } from "../hooks/useHeatmap";
import { ChartCard } from "./ChartCard";
import { CalendarHeatmap } from "./charts/CalendarHeatmap";

type Props = URLFilters;

export function Heatmap({ ...filters }: Props) {
  const { data } = useHeatmap(filters);

  return (
    <ChartCard>
      <div className="h-44 w-full">
        <CalendarHeatmap data={data} />
      </div>
    </ChartCard>
  );
}
