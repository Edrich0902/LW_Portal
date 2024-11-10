<script lang="ts">
    import {Button, Modal, P} from 'flowbite-svelte';

    export let open = false;
    export let confirm: () => void
    export let title;
    export let message: string = "";
</script>

<Modal bind:open={open} size="xs" autoclose {title}>
    {#if message}<P size="sm">{message}</P>{/if}
    <div class="text-right">
        <Button color="none">Cancel</Button>
        <Button on:click={confirm}>Confirm</Button>
    </div>
</Modal>