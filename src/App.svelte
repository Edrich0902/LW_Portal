<script lang="ts">
  import { Router, Route, navigate } from "svelte-routing";
  import { Auth, Dashboard, Sermons, Users } from "./lib/routes";
  import { onMount } from "svelte";
  import { supabase } from "./supabaseClient";
  import Authguard from "./lib/gaurds/authguard.svelte";
  import { Lwptoast, Lwpdrawer, LwpPageContainer } from "./lib/components";
  import { writable } from "svelte/store";

  onMount(async () => {
    // Check initial session
    const sessionResponse = await supabase.auth.getSession();

    if (sessionResponse.data.session) {
      // there is a valid session
      if (window.location.pathname == "/" || window.location.pathname == "") {
        navigate("/dashboard", {replace: true});
      }
    } else {
      // there is no valid session route to login
      navigate("/", {replace: true});
    }
  });

  const isAuthed = writable<boolean>(false);

  supabase.auth.onAuthStateChange((event, session) => {
    if (session != null) isAuthed.set(true);
    else isAuthed.set(false);
  });

</script>

<!-- Show drawer only if authed -->
<div class="flex flex-row items-start gap-x-2">
  {#if $isAuthed}
    <Lwpdrawer />
  {/if}

  <!-- APP ROUTES -->
  <Router>

    <!-- Auth Route -->
    <Route path="/">
      <Auth />
    </Route>

    <!-- Dashboard Route -->
    <Route path="/dashboard">
      <Authguard>
        <LwpPageContainer>
          <Dashboard />
        </LwpPageContainer>
      </Authguard>
    </Route>

    <!-- Sermons Route -->
    <Route path="/sermons">
      <Authguard>
        <LwpPageContainer>
          <Sermons />
        </LwpPageContainer>
      </Authguard>
    </Route>

    <Route path="/users">
      <Authguard>
        <LwpPageContainer>
          <Users />
        </LwpPageContainer>
      </Authguard>
    </Route>

  </Router>
</div>

<!-- Global Toast Manager -->
<Lwptoast />