<script>
  import { Navigation } from "$components/Navigation";
  import { Content } from "carbon-components-svelte";
</script>

<Navigation />

<Content>
  <section class="auth-page">
    <slot />
  </section>
</Content>

<style>
  .auth-page {
    width: 560px;
    margin: auto;
  }
</style>
