<script lang="ts">
  import Heatmap from "$components/charts/Heatmap.svelte";
  import LanguageStream from "$components/charts/LanguageStream.svelte";

  export let data;

  $: heatmap = data.heatmap;
  $: languageStream = data.languageStream;
</script>

<Heatmap data={heatmap} />

<LanguageStream data={languageStream} />
