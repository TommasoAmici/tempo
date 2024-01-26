<script lang="ts">
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import Button from "$components/Button.svelte";
  import Form from "$components/Form.svelte";
  import FormGroup from "$components/FormGroup.svelte";
  import Input from "$components/Input.svelte";
  import PageTitle from "$components/PageTitle.svelte";
  import PasswordInput from "$components/PasswordInput.svelte";
  import { authorizedStore, client } from "$lib/client";
  import { toasts } from "$lib/toasts";

  let name = "";
  let email = "";
  let password = "";

  async function onSubmit(e: Event) {
    e.preventDefault();
    try {
      await client.signup(name, email, password);
      toasts.success("User created successfully");
      await goto("/login");
    } catch (error) {
      toasts.error("Could not create user");
    }
  }

  let authorized = $authorizedStore;
  if (browser && authorized) {
    goto("/");
  }
</script>

<PageTitle>Sign up</PageTitle>

<Form {onSubmit}>
  <FormGroup>
    <Input bind:value={name} label="Name" name="name" required />
  </FormGroup>
  <FormGroup>
    <Input
      bind:value={email}
      label="Email"
      type="email"
      name="email"
      required
    />
  </FormGroup>
  <FormGroup>
    <PasswordInput bind:value={password} required />
  </FormGroup>
  <Button type="submit">Sign Up</Button>
</Form>
