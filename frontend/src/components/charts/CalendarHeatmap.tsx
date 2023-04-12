// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/calendar
import { ResponsiveTimeRange } from "@nivo/calendar";
import colors from "tailwindcss/colors";
import { HeatmapData } from "../../hooks/useHeatmap";

const COLOR_SCALE = [
  colors.emerald[200],
  colors.emerald[400],
  colors.emerald[600],
  colors.emerald[800],
];

const MONTH_LEGEND_OFFSET = 10;

type Props = {
  data: HeatmapData[] | undefined;
};

export function CalendarHeatmap({ data }: Props) {
  const today = Temporal.Now.plainDateISO();
  const oneYearAgo = today.subtract(Temporal.Duration.from({ years: 1 }));

  return (
    <ResponsiveTimeRange
      data={data ?? []}
      from={oneYearAgo.toString()}
      to={today.toString()}
      emptyColor={colors.zinc[200]}
      colors={COLOR_SCALE}
      margin={{ top: 2 * MONTH_LEGEND_OFFSET, right: 0, bottom: 0, left: 0 }}
      dayBorderWidth={2}
      dayBorderColor={colors.slate[50]}
      monthLegendOffset={MONTH_LEGEND_OFFSET}
    />
  );
}
