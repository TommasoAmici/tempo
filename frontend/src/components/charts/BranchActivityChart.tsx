import { ResponsiveBar } from "@nivo/bar";
import { Margin } from "@nivo/core";
import { CATEGORY_COLORS } from "../../lib/colors";

/**
 * The value of the labelSkipHeight prop is used to determine if a label should be
 * displayed or not. If the height of the bar is less than the value of this constant,
 * the label will not be displayed.
 */
const SKIP_LABEL = 10;

export type ActivityData = {
  date: string;
  values: Record<string, number> | null;
};

type Props = {
  data: ActivityData[] | undefined;
  margin?: Partial<Margin>;
};

export function BranchActivityChart({ data, margin = { left: 30, bottom: 40 } }: Props) {
  const uniqueKeys = [...new Set(data?.flatMap(d => Object.keys(d.values ?? [])))];
  return (
    <ResponsiveBar
      keys={uniqueKeys}
      data={data?.map(d => ({ date: d.date, ...d.values })) ?? []}
      indexBy="date"
      colors={({ id }) =>
        CATEGORY_COLORS[uniqueKeys.indexOf(id.toString()) % CATEGORY_COLORS.length]
      }
      margin={margin}
      labelSkipHeight={SKIP_LABEL}
      axisBottom={{
        tickRotation: -25,
        tickValues: data?.map(d => (d.values !== null ? d.date : undefined)),
      }}
    />
  );
}
