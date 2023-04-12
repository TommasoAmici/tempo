import useSWR from "swr";
import { URLFilters, buildURL } from "./url";

export type LanguageActivity = {
  language: string;
  total_time: number;
};

export function useAnalysisLanguages(filters: URLFilters) {
  const url = buildURL("/api/v1/users/languages", filters);

  const { data, error, isLoading } = useSWR<LanguageActivity[]>(url.toString());

  return {
    data,
    isLoading,
    isError: error !== undefined,
  };
}
