<script lang="ts">
  import { onMount } from "svelte";
  import { supabase } from "../../supabaseClient";
  import { navigate } from "svelte-routing";

  let isAuthed = false;

  onMount(async () => {
    // Check initial session
    const sessionResponse = await supabase.auth.getSession();

    if (sessionResponse.data.session) {
      isAuthed = true;
    } else {
      isAuthed = false;
      navigate("/", {replace: true});
    }
  });

</script>

{#if isAuthed}
    <slot></slot>
{/if}