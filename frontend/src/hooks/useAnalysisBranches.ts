import useSWR from "swr";
import { ActivityData } from "../components/charts/BranchActivityChart";
import { URLFilters, buildURL } from "./url";

export function useAnalysisBranches(filters: URLFilters) {
  const url = buildURL("/api/v1/users/branches", filters);

  const { data, error, isLoading } = useSWR<ActivityData[]>(url.toString());

  return {
    data,
    isLoading,
    isError: error !== undefined,
  };
}
