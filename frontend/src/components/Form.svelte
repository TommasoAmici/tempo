<script lang="ts">
  import { Form } from "carbon-components-svelte";
  export let onSubmit: undefined | ((e: Event) => void) = undefined;
</script>

<Form class="w-md" on:submit={onSubmit}><slot /></Form>
