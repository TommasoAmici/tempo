import { ResponsiveAreaBump } from "@nivo/bump";
import type { ComponentProps } from "react";
// https://github.com/ozh/github-colors/blob/master/colors.json
import LANGUAGE_COLORS from "./languageColors.json";

type Props = {
  data: ComponentProps<typeof ResponsiveAreaBump>["data"];
};

export function LanguageStreamChart({ data }: Props) {
  return (
    <ResponsiveAreaBump
      data={data}
      margin={{ top: 20, right: 70, bottom: 30, left: 40 }}
      spacing={2}
      // @ts-expect-error
      colors={({ id }) => LANGUAGE_COLORS[id]?.color ?? "#000000"}
      axisTop={{
        tickSize: 5,
        tickPadding: 5,
      }}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
      }}
    />
  );
}
