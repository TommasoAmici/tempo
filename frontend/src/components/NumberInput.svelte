<script lang="ts">
  import { NumberInput } from "carbon-components-svelte";

  export let value: number;
  export let label: string;

  let touched = false;

  $: invalid = touched && (Number.isNaN(value) || value === null);
  $: invalidText = invalid ? "Invalid number" : "";

  function onInput() {
    touched = true;
  }
</script>

<NumberInput
  on:input={onInput}
  bind:value
  {label}
  {invalid}
  {invalidText}
  {...$$restProps}
/>
