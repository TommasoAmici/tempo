<script lang="ts">
  import { PasswordInput } from "carbon-components-svelte";

  export let value = "";
  export let required = false;
</script>

<PasswordInput
  labelText="Password"
  bind:value
  {required}
  name="password"
  {...$$restProps}
/>
