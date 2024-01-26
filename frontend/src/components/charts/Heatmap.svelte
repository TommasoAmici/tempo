<script lang="ts">
  import type { HeatmapData } from "$lib/client";
  import { HeatmapChart, ScaleTypes } from "@carbon/charts-svelte";

  export let data: HeatmapData[];

  const days: Record<number, string> = {
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
    7: "Sunday",
  };

  $: startDay = Temporal.PlainDate.from(data[0].date);
  $: dataFormatted = Array(startDay.dayOfWeek)
    .fill(null)
    .map<HeatmapData>((_, i) => ({
      date: startDay.subtract(new Temporal.Duration(0, 0, 0, i)).toString(),
      value: null,
    }))
    .toReversed()
    .concat(data)
    .map((d) => {
      const date = Temporal.PlainDate.from(d.date);
      return {
        day: days[date.dayOfWeek],
        week: date.weekOfYear,
        value: d.value,
      };
    });

  const options = {
    heatmap: {},
    axes: {
      bottom: {
        title: "Week",
        mapsTo: "week",
        scaleType: ScaleTypes.LABELS,
      },
      left: {
        title: "Day",
        mapsTo: "day",
        scaleType: ScaleTypes.LABELS,
      },
    },
    height: "300px",
    color: {
      gradient: {
        enabled: true,
        colors: [
          "#ecfdf5",
          "#d1fae5",
          "#a7f3d0",
          "#6ee7b7",
          "#34d399",
          "#10b981",
          "#059669",
          "#047857",
          "#065f46",
          "#064e3b",
          "#022c22",
        ],
      },
    },
  };
</script>

<HeatmapChart data={dataFormatted} {options} />
