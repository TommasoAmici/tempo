"use client";
import useSWR from "swr";
import { URLFilters, buildURL } from "./url";

/**
 * @param filters
 * @returns list of branches for a project
 */
export function useBranches({ project, ...filters }: URLFilters) {
  const url = buildURL(`/api/v1/users/projects/${project}/branches`, filters);

  const { data, error, isLoading } = useSWR<string[]>(project ? url.toString() : null);

  return {
    data,
    isLoading,
    isError: error !== undefined,
  };
}
