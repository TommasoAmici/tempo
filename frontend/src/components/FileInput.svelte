<script lang="ts">
  import { FileUploaderButton } from "carbon-components-svelte";

  export let onChange: (e: CustomEvent<readonly File[]>) => void;
</script>

<FileUploaderButton labelText="Add file" on:change={onChange} />
