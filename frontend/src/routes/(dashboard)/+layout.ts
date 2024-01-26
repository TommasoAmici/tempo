import { goto } from "$app/navigation";
import { client } from "$lib/client";

export async function load({ url }) {
  const date_start = url.searchParams.get("date_start");
  const date_end = url.searchParams.get("date_end");
  const project = url.searchParams.get("project");
  const branch = url.searchParams.get("branch");
  const filters = { date_end, date_start, project, branch };

  try {
    const [projects, heatmap, languageStream] = await Promise.all([
      client.getProjects(filters),
      client.getHeatmap(filters),
      client.getLanguageStream(filters),
    ]);
    return {
      projects,
      heatmap,
      filters,
      languageStream,
    };
  } catch (error) {
    return goto("/login", { invalidateAll: true });
  }
}
