import useSWR from "swr";
import { URLFilters, buildURL } from "./url";

export type LanguageStream = {
  id: string;
  data: { x: string; y: number }[];
};

export function useLanguageStream(filters: URLFilters) {
  const url = buildURL("/api/v1/users/languages-stream", filters);

  const { data, error, isLoading } = useSWR<LanguageStream[]>(url.toString());

  return {
    data,
    isLoading,
    isError: error !== undefined,
  };
}
