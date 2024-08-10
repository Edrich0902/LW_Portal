<script lang="ts">
    import { Hr, P } from "flowbite-svelte";
    import { initSermons, sermonsStore } from "./sermons.store";
    import { Status } from "../../types";
    import { onMount } from "svelte";
    import { LwpLoader } from "../../components";

    $: ({ data, status } = $sermonsStore);

    onMount(() => {
        initSermons();
    });
</script>

<svelte:head>
    <title>LWP | Sermons</title>
</svelte:head>

<div>
    {#if status == Status.LOADING}
        <LwpLoader message={"Loadig Sermons"} messageSize="xs" />
    {/if}

    {#if status == Status.OK}
        {#each data as sermon}
            <P>{sermon.title}</P>
            <P>{sermon.pastor}</P>
            <Hr />
        {/each}
    {/if}
</div>