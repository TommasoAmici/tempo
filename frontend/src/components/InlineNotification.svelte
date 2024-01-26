<script lang="ts">
  import { InlineNotification } from "carbon-components-svelte";
  export let message: string;
</script>

<InlineNotification title="Error:" subtitle={message} />
