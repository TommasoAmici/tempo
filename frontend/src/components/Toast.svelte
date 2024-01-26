<script lang="ts">
  import { ToastNotification } from "carbon-components-svelte";

  import { toasts, type ToastLevel } from "$lib/toasts";

  export let id: number;
  export let message: string;
  export let level: ToastLevel;

  const levelTitles: Record<ToastLevel, string> = {
    info: "Info",
    error: "Error",
    success: "Success",
    warning: "Warning",
  };

  const title = levelTitles[level];

  function onClose() {
    toasts.remove(id);
  }
</script>

<ToastNotification {title} kind={level} caption={message} on:close={onClose} />
