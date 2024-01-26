import { goto } from "$app/navigation";
import { authorizedStore } from "$lib/client";
import { get } from "svelte/store";

export const ssr = false;

export async function load() {
  const authorized = get(authorizedStore);
  if (authorized) {
    return goto("/");
  }
}
