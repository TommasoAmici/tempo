<script lang="ts">
  import { Button } from "carbon-components-svelte";

  export let disabled = false;
  export let onClick: ((e: Event) => void) | undefined = undefined;
</script>

<Button {disabled} on:click={onClick} {...$$restProps}><slot /></Button>
