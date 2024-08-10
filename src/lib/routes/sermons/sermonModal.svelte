<script lang="ts">
    import { Modal, P } from "flowbite-svelte";
    import type { Sermon } from "../../types";

    export let open: boolean = false;
    export let sermon: Sermon;
    export let closeCallback: () => void;
</script>

<Modal title={sermon?.id ? 'Edit Sermon' : 'Add Sermon'} bind:open={open} on:close={() => closeCallback()}>
    <P>Testing a modal</P>
</Modal>