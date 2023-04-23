import { ResponsiveAreaBump } from "@nivo/bump";
import type { ComponentProps } from "react";

type Props = {
  data: ComponentProps<typeof ResponsiveAreaBump>["data"];
};

export function LanguageStreamChart({ data }: Props) {
  return (
    <ResponsiveAreaBump
      data={data}
      margin={{ top: 20, right: 40, bottom: 20, left: 40 }}
      spacing={8}
      colors={{ scheme: "nivo" }}
      blendMode="multiply"
      axisTop={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "",
        legendPosition: "middle",
        legendOffset: -36,
      }}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "",
        legendPosition: "middle",
        legendOffset: 32,
      }}
    />
  );
}
