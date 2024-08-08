<script lang="ts">
  import { Router, Route } from "svelte-routing";
  import { Auth, Dashboard } from "./lib/routes";
</script>

<!-- APP ROUTES -->
<Router>

  <!-- Auth Route -->
  <Route path="">
    <Auth />
  </Route>

  <!-- Dashboard Route -->
  <Route path="/dashboard">
    <Dashboard />
  </Route>

</Router>