<script lang="ts">
    import { Button, Helper, Input, Label, Modal, Select, Spinner, Textarea } from "flowbite-svelte";
    import { createForm } from "svelte-forms-lib";
    import { GroupType, Status, ToastType, type Group } from "../../types";
    import { connectServeModalStore, createConnectServeGroup, initConnectServeModal, updateConnectServeGroup } from "./connectServeModal.store";
    import * as yup from "yup";
    import { toast } from "../../components";

    export let open: boolean = false;
    export let group: Group;
    export let closeCallback: (reload: boolean) => void;

    $: ({ status } = $connectServeModalStore);

    const groupTypes = Object.values(GroupType) as string[];

    const { form, errors, handleChange, handleSubmit } = createForm<Group>({
        initialValues: {
            id: group?.id ?? undefined,
            title: group?.title ?? undefined,
            description: group?.description ?? undefined,
            type: group?.type ?? undefined,
            location: group?.location ?? undefined,
            whatsappLink: group?.whatsappLink ?? undefined,
        },
        validationSchema: yup.object<Group>().shape({
            title: yup.string().required('Title is required'),
            description: yup.string().required('Description is required'),
            type: yup.string().required('Type is required'),
            location: yup.string(),
            whatsappLink: yup.string(),
        }),
        onSubmit: values => {
            if (values.id) updateConnectServeGroup(values);
            else createConnectServeGroup(values);
        }
    });

    connectServeModalStore.subscribe(state => {
        if (state.status == Status.OK) {
            toast({message: 'Group Saved', type: ToastType.SUCCESS});
            closeCallback(true);

            initConnectServeModal();
        }
        if (state.status == Status.ERROR) {
            toast({message: 'Error Saving Group', type: ToastType.ERROR});
        }
    });

</script>

<Modal title={group?.id ? 'Edit Group' : 'Add Group'} bind:open={open} on:close={() => closeCallback(false)}>
    <form class="flex flex-col space-y-6" on:submit|preventDefault={handleSubmit}>

        <Label class="space-y-2">
            <span>Title</span>
            <Input on:change={handleChange} on:blur={handleChange} bind:value={$form.title} type="text" name="title" />
            {#if $errors.title}<Helper class="mt-2" color="red">{$errors.title}</Helper>{/if}
        </Label>

        <Label class="space-y-2">
            <span>Description</span>
            <Textarea on:change={handleChange} on:blur={handleChange} bind:value={$form.description} rows="4" name="description"/>
            {#if $errors.description}<Helper class="mt-2" color="red">{$errors.description}</Helper>{/if}
        </Label>

        <Label class="space-y-2">
            <span>Type</span>
            <Select on:change={handleChange} on:blur={handleChange} bind:value={$form.type} name="type">
                {#each groupTypes as groupType}
                    <option value={groupType}>{groupType}</option>
                {/each}
            </Select>
            {#if $errors.type}<Helper class="mt-2" color="red">{$errors.type}</Helper>{/if}
        </Label>

        <Label class="space-y-2">
            <span>Whatsapp Link</span>
            <Input on:change={handleChange} on:blur={handleChange} bind:value={$form.whatsappLink} type="text" name="whatsappLink" />
            {#if $errors.whatsappLink}<Helper class="mt-2" color="red">{$errors.whatsappLink}</Helper>{/if}
        </Label>

        <Label class="space-y-2">
            <span>Location</span>
            <Input on:change={handleChange} on:blur={handleChange} bind:value={$form.location} type="text" name="location" />
            {#if $errors.location}<Helper class="mt-2" color="red">{$errors.location}</Helper>{/if}
        </Label>

        <div class="flex flex-row justify-end items-center">
            <Button on:click={() => closeCallback(false)} color="none">Cancel</Button>
            <Button type="submit">
                {#if status == Status.LOADING}
                    <Spinner class="me-3" size="4" color="white" />
                {/if}
                Save
            </Button>
        </div>
    </form>
</Modal>