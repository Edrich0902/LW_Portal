<script lang="ts">
    import { Hr, P } from "flowbite-svelte";
    import { initSermons, sermonsStore } from "./sermons.store";
    import { Status } from "../../types";
    import { onMount } from "svelte";

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
        <P>Loading....</P>
    {/if}

    {#if status == Status.OK}
        {#each data as sermon}
            <P>{sermon.title}</P>
            <P>{sermon.pastor}</P>
            <Hr />
        {/each}
    {/if}
</div>