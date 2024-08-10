<script lang="ts">
    import { P, Spinner } from "flowbite-svelte";

    export let size: number = 6;
    export let message: string = "";
    export let messageSize: | "9xl" | "8xl" | "7xl" | "6xl" | "5xl" | "4xl" | "3xl" | "2xl" | "xl" | "lg" | "base" | "sm" | "xs" = "base";

</script>

<div class="flex flex-col justify-center items-center gap-y-1">
    <Spinner {size} />
    {#if message}
        <P size={messageSize}>{message}</P>
    {/if}
</div>