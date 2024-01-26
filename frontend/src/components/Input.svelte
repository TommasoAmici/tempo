<script lang="ts">
  import { TextInput } from "carbon-components-svelte";

  export let value = "";
  export let label: string;
  export let help: string = "";
  export let required = false;
</script>

<TextInput
  labelText={label}
  helperText={help}
  {required}
  bind:value
  {...$$restProps}
/>
