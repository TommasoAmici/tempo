import { useHeatmap } from "../hooks/useHeatmap";
import { DateFilter } from "../lib/filters";
import { CalendarHeatmap } from "./charts/CalendarHeatmap";

type Props = {
  project?: string | null;
  dateStart?: DateFilter;
  dateEnd?: DateFilter;
};

export function Heatmap({ project, dateStart, dateEnd }: Props) {
  const { data } = useHeatmap({ project, dateStart, dateEnd });

  return (
    <div className="h-44 w-full">
      <CalendarHeatmap data={data} />
    </div>
  );
}
