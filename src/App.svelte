<script lang="ts">
  import { Router, Route, navigate } from "svelte-routing";
  import { Auth, Dashboard } from "./lib/routes";
  import { onMount } from "svelte";
  import { supabase } from "./supabaseClient";
  import Authguard from "./lib/gaurds/authguard.svelte";

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
</script>

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