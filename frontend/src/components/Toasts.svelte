<script lang="ts">
  import { toasts } from "$lib/toasts";
  import Toast from "./Toast.svelte";

  const items = toasts.list();
</script>

{#if $items}
  <section class="fixed bottom-0 right-0 z-100">
    {#each $items as toast (toast.id)}
      <Toast id={toast.id} level={toast.level} message={toast.message} />
    {/each}
  </section>
{/if}
