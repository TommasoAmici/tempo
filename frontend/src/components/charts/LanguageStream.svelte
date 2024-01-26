<script lang="ts">
  import type { LanguageStream } from "$lib/client";
  import {
    ScaleTypes,
    StackedAreaChart,
    type StackedAreaChartOptions,
  } from "@carbon/charts-svelte";
  // https://github.com/ozh/github-colors/blob/master/colors.json
  import LANGUAGE_COLORS from "./languageColors.json";

  export let data: LanguageStream[];
  $: formattedData = data.flatMap((lang) =>
    lang.data.map((d) => ({ group: lang.id, date: d.x, value: d.y })),
  );
  const options: StackedAreaChartOptions = {
    axes: {
      left: {
        stacked: true,
        scaleType: ScaleTypes.LINEAR,
        mapsTo: "value",
      },
      bottom: {
        scaleType: ScaleTypes.TIME,
        mapsTo: "date",
      },
    },
    curve: "curveMonotoneX",
    getFillColor: function (group: string) {
      // @ts-expect-error string can't be used to index const
      return LANGUAGE_COLORS[group]?.color ?? "#000";
    },
    getStrokeColor: function (group: string) {
      // @ts-expect-error string can't be used to index const
      return LANGUAGE_COLORS[group]?.color ?? "#000";
    },
    height: "400px",
  };
</script>

<StackedAreaChart data={formattedData} {options} />
