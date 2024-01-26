import { browser } from "$app/environment";
import { writable } from "svelte/store";

export const authorizedStore = writable(false);

export type HeatmapData = {
  date: string;
  value: number | null;
};

export type LanguageStream = {
  id: string;
  data: { x: string; y: number }[];
};

export type ActivityData = {
  date: string;
  values: Record<string, number> | null;
};

export type LanguageActivity = {
  language: string;
  total_time: number;
};

export type URLFilters = {
  branch?: string | null;
  project?: string | null;
  date_start?: string | null;
  date_end?: string | null;
};

export const filterKeys = [
  "date_start",
  "date_end",
  "project",
  "branch",
] as const;

class APIClient {
  #baseURL = "";
  #token: string | null = null;

  constructor() {
    if (browser) {
      this.#token = localStorage.getItem("apiToken");
      if (this.#token) {
        authorizedStore.set(true);
      }
    }
  }

  async get<T>(url: string) {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Basic " + btoa(this.#token ?? ""),
      },
    });
    if (res.status === 401) {
      throw new Error("User not authorized");
    }
    const data: T = await res.json();
    return data;
  }

  async login(email: string, password: string) {
    const res = await fetch("/api/v1/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (res.ok) {
      const data: { token: string; user_id: string } = await res.json();
      this.#token = data.token;
      localStorage.setItem("apiToken", data.token);
      authorizedStore.set(true);
    } else {
      const text = await res.text();
      return { status: res.status, text };
    }
  }

  async signup(email: string, password: string, repeat_password: string) {
    const res = await fetch("/api/v1/users/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, repeat_password }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (!res.ok) {
      const text = await res.text();
      return { status: res.status, text };
    }
  }

  async logout() {
    // TODO send request to backend, invalidate token
    this.#token = null;
    localStorage.removeItem("apiToken");
    authorizedStore.set(false);
  }

  #buildURL(endpoint: string, filters: URLFilters) {
    const params = new URLSearchParams();
    for (const filter of [
      "date_start",
      "date_end",
      "project",
      "branch",
    ] as const) {
      const value = filters[filter];
      if (value) {
        params.set(filter, value.toString());
      } else {
        params.delete(filter);
      }
    }
    return this.#baseURL + endpoint + "?" + params.toString();
  }

  async getHeatmap(filters: URLFilters) {
    const url = this.#buildURL("/api/v1/users/heatmap", filters);
    return this.get<HeatmapData[]>(url);
  }

  async getBranches({ project, ...filters }: URLFilters) {
    const url = this.#buildURL(
      `/api/v1/users/projects/${project}/branches`,
      filters
    );
    return this.get<string[]>(url);
  }

  async getProjects(filters: URLFilters) {
    const url = this.#buildURL("/api/v1/users/projects", filters);
    return this.get<string[]>(url);
  }

  async getLanguageStream(filters: URLFilters) {
    const url = this.#buildURL("/api/v1/users/languages-stream", filters);
    return this.get<LanguageStream[]>(url);
  }

  async getAnalysisBranches(filters: URLFilters) {
    const url = this.#buildURL("/api/v1/users/branches", filters);
    return this.get<ActivityData[]>(url);
  }

  async getAnalysisLanguages(filters: URLFilters) {
    const url = this.#buildURL("/api/v1/users/languages", filters);
    return this.get<LanguageActivity[]>(url);
  }
}

export const client = new APIClient();
