<script lang="ts">
  import { authorizedStore } from "$lib/client";
  import {
    Header,
    HeaderNavItem,
    HeaderUtilities,
    SideNav,
    SkipToContent,
  } from "carbon-components-svelte";
  import LogoutAction from "./LogoutAction.svelte";

  $: authorized = $authorizedStore;

  let isSideNavOpen = true;
</script>

<Header platformName="Tempo" href="/" bind:isSideNavOpen>
  <svelte:fragment slot="skip-to-content">
    <SkipToContent />
  </svelte:fragment>
  <HeaderUtilities>
    {#if authorized}
      <LogoutAction />
    {:else}
      <HeaderNavItem href="/login" text="Login" />
      <HeaderNavItem href="/signup" text="Sign up" />
    {/if}
  </HeaderUtilities>
</Header>

{#if authorized}
  <SideNav isOpen={isSideNavOpen}>
    <slot name="sidebar" />
  </SideNav>
{/if}
