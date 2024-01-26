<script lang="ts">
  import { ComboBox } from "carbon-components-svelte";

  type ComboboxItem = { id: string; text: string };

  export let label: string;
  export let required = false;
  export let help: string | undefined = undefined;
  export let placeholder: string | undefined = undefined;
  export let items: ComboboxItem[];
  export let selected: string | undefined | null;
  export let onChange: (
    e: CustomEvent<{ selectedId: string; selectedItem: ComboboxItem }>,
  ) => void;

  function shouldFilterItem(item: ComboboxItem, value: string) {
    if (!value) {
      return true;
    }
    return item.text.toLowerCase().includes(value.toLowerCase());
  }

  $: titleText = label;
</script>

<ComboBox
  {required}
  {titleText}
  helperText={help}
  {placeholder}
  {items}
  {shouldFilterItem}
  bind:selectedId={selected}
  on:select={onChange}
  on:clear={onChange}
/>
