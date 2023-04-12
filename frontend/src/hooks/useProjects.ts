"use client";
import useSWR from "swr";
import { URLFilters, buildURL } from "./url";

export function useProjects(filters: URLFilters) {
  const url = buildURL("/api/v1/users/projects", filters);

  const { data, error, isLoading } = useSWR<string[]>(url.toString());

  return {
    data,
    isLoading,
    isError: error !== undefined,
  };
}
