<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Combobox from "$components/Combobox.svelte";
  import DateInput from "$components/DateInput.svelte";
  import FormGroup from "$components/FormGroup.svelte";
  import Navigation from "$components/Navigation/Navigation.svelte";
  import { filterKeys, type URLFilters } from "$lib/client";
  import { Content } from "carbon-components-svelte";

  export let data;
  $: projectItems = data.projects.map((p) => ({ id: p, text: p }));
  $: filters = data.filters;
  $: selectedProjected = filters.project;
  $: dateStart = filters.date_start ?? undefined;
  $: dateEnd = filters.date_end ?? undefined;

  async function gotoWithFilters(filters: URLFilters) {
    const url = $page.url;
    for (const filter of filterKeys) {
      const value = filters[filter];
      if (value) {
        url.searchParams.set(filter, value.toString());
      } else {
        url.searchParams.delete(filter);
      }
    }
    await goto(url.toString(), { invalidateAll: true });
  }
</script>

<Navigation>
  <svelte:fragment slot="sidebar">
    <section class="sidebar-filters">
      <h2>Filters</h2>
      <FormGroup>
        <Combobox
          label="Project"
          items={projectItems}
          selected={selectedProjected}
          onChange={(e) =>
            gotoWithFilters({ ...filters, project: e.detail.selectedId })}
        />
      </FormGroup>
      <FormGroup>
        <DateInput
          label="Start date"
          value={dateStart}
          onChange={(e) => {
            const detail = e.detail;
            if (
              typeof detail === "object" &&
              "dateStr" in detail &&
              typeof detail.dateStr === "string"
            ) {
              gotoWithFilters({
                ...filters,
                date_start: detail.dateStr,
              });
            }
          }}
        />
      </FormGroup>
      <FormGroup>
        <DateInput
          label="End date"
          value={dateEnd}
          onChange={(e) => {
            const detail = e.detail;
            if (
              typeof detail === "object" &&
              "dateStr" in detail &&
              typeof detail.dateStr === "string"
            ) {
              gotoWithFilters({
                ...filters,
                date_end: detail.dateStr,
              });
            }
          }}
        />
      </FormGroup>
    </section>
  </svelte:fragment>
</Navigation>

<Content>
  <slot />
</Content>

<style>
  .sidebar-filters {
    padding: 16px;
  }

  .sidebar-filters h2 {
    margin-bottom: 1rem;
  }
</style>
