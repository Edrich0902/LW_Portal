<script lang="ts">
    import { Button, Helper, Input, Label, Modal, Spinner } from "flowbite-svelte";
    import { Status, ToastType, type Sermon } from "../../types";
    import { createForm } from "svelte-forms-lib";
    import * as yup from "yup";
    import { createSermon, initSermonModal, sermonModalStore, updateSermon } from "./sermonModal.store";
    import { toast } from "../../components";

    export let open: boolean = false;
    export let sermon: Sermon;
    export let closeCallback: (reload: boolean) => void;

    $: ({ status } = $sermonModalStore);

    const { form, errors, handleChange, handleSubmit } = createForm<Sermon>({
        initialValues: {
            id: sermon?.id ?? undefined,
            title: sermon?.title ?? undefined,
            pastor: sermon?.pastor ?? undefined,
            link: sermon?.link ?? undefined,
            description: sermon?.description ?? undefined,
        },
        validationSchema: yup.object<Sermon>().shape({
            title: yup.string().required('Sermon title required'),
            pastor: yup.string().required('Pastor required'),
            link: yup.string().required('Link required'),
        }),
        onSubmit: values => {
            if (values.id) updateSermon(values);
            else createSermon(values);
        }
    });

    sermonModalStore.subscribe(state => {
        if (state.status == Status.OK) {
            toast({message: 'Sermon Saved', type: ToastType.SUCCESS})
            closeCallback(true);

            initSermonModal();
        }
        if (state.status == Status.ERROR) {
            toast({message: 'Error Saving Sermon', type: ToastType.ERROR})
        }
    })
</script>

<Modal title={sermon?.id ? 'Edit Sermon' : 'Add Sermon'} bind:open={open} on:close={() => closeCallback(false)}>
    <form class="flex flex-col space-y-6" on:submit|preventDefault={handleSubmit}>

        <Label class="space-y-2">
            <span>Title</span>
            <Input on:change={handleChange} on:blur={handleChange} bind:value={$form.title} type="text" name="title" />
            {#if $errors.title}<Helper class="mt-2" color="red">{$errors.title}</Helper>{/if}
        </Label>

        <Label class="space-y-2">
            <span>Pastor</span>
            <Input on:change={handleChange} on:blur={handleChange} bind:value={$form.pastor} type="text" name="pastor" />
            {#if $errors.pastor}<Helper class="mt-2" color="red">{$errors.pastor}</Helper>{/if}
        </Label>

        <Label class="space-y-2">
            <span>Youtube Link</span>
            <Input on:change={handleChange} on:blur={handleChange} bind:value={$form.link} type="text" name="link" />
            {#if $errors.link}<Helper class="mt-2" color="red">{$errors.link}</Helper>{/if}
        </Label>

        <Label class="space-y-2">
            <span>Description</span>
            <Input on:change={handleChange} on:blur={handleChange} bind:value={$form.description} type="text" name="description" />
            {#if $errors.description}<Helper class="mt-2" color="red">{$errors.description}</Helper>{/if}
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