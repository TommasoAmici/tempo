"use client";
import { DateFilter } from "../lib/filters";

export type URLFilters = {
  branch?: string | null;
  project?: string | null;
  dateStart?: DateFilter;
  dateEnd?: DateFilter;
};

export function buildURL(endpoint: string, { branch, project, dateStart, dateEnd }: URLFilters) {
  const params = new URLSearchParams();
  if (dateStart) {
    params.set("date_start", dateStart.toJSON());
  }
  if (dateEnd) {
    params.set("date_end", dateEnd.toJSON());
  }
  if (project) {
    params.set("project", project);
  }
  if (branch) {
    params.set("branch", branch);
  }
  return endpoint + "?" + params.toString();
}
