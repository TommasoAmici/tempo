import useSWR from "swr";
import { URLFilters, buildURL } from "./url";

export type HeatmapData = {
  day: string;
  value: number;
};

export function useHeatmap(filters: URLFilters) {
  const url = buildURL("/api/v1/users/heatmap", filters);

  const { data, error, isLoading } = useSWR<HeatmapData[]>(url.toString());

  return {
    data,
    isLoading,
    isError: error !== undefined,
  };
}
