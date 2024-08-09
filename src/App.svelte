<script lang="ts">
  import { Router, Route, navigate } from "svelte-routing";
  import { Auth, Dashboard } from "./lib/routes";
  import { onMount } from "svelte";
  import { supabase } from "./supabaseClient";
  import Authguard from "./lib/gaurds/authguard.svelte";
  import { Lwptoast } from "./lib/components";
  import Lwpdrawer from "./lib/components/lwp-drawer/lwpdrawer.svelte";
  import { writable } from "svelte/store";

  onMount(async () => {
    // Check initial session
    const sessionResponse = await supabase.auth.getSession();

    if (sessionResponse.data.session) {
      // there is a valid session
      navigate("/dashboard", {replace: true});
    } else {
      // there is no valid session route to login
      navigate("", {replace: true});
    }
  });

  const isAuthed = writable<boolean>(false);

  supabase.auth.onAuthStateChange((event, session) => {
    if (session != null) isAuthed.set(true);
    else isAuthed.set(false);
  });

</script>

<!-- Show drawer only if authed -->
<div class="flex flex-row">
  {#if $isAuthed}
    <Lwpdrawer />
  {/if}

  <!-- APP ROUTES -->
  <Router>

    <!-- Auth Route -->
    <Route path="">
      <Auth />
    </Route>

    <!-- Dashboard Route -->
    <Route path="/dashboard">
      <Authguard>
        <Dashboard />
      </Authguard>
    </Route>

  </Router>
</div>

<!-- Global Toast Manager -->
<Lwptoast />