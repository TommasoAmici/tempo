<script lang="ts">
  import { goto } from "$app/navigation";
  import { client } from "$lib/client";
  import { toasts } from "$lib/toasts";
  import { HeaderGlobalAction } from "carbon-components-svelte";
  import Logout from "carbon-icons-svelte/lib/Logout.svelte";

  async function onClick() {
    try {
      await client.logout();
      toasts.info("Successfully logged out");
      await goto("/login", { invalidateAll: true });
    } catch (error) {
      toasts.error("Failed to logout");
    }
  }
</script>

<HeaderGlobalAction aria-label="Logout" icon={Logout} on:click={onClick} />
