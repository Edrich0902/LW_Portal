<script lang="ts">
    import { Button, Helper, Input, Label, Modal, Spinner } from "flowbite-svelte";
    import { createForm } from "svelte-forms-lib";
    import { Status, ToastType, type Roleplayer } from "../../types";
    import { createRoleplayer, initRoleplayerModal, roleplayerModalStore, updateRoleplayer } from "./roleplayerModal.store";
    import * as yup from "yup";
    import { toast } from "../../components";

    export let open: boolean = false;
    export let roleplayer: Roleplayer;
    export let closeCallback: (reload: boolean) => void;

    $: ({ status } = $roleplayerModalStore);

    const { form, errors, handleChange, handleSubmit } = createForm<Roleplayer>({
        initialValues: {
            id: roleplayer?.id ?? undefined,
            fullname: roleplayer?.fullname ?? undefined,
            title: roleplayer?.title ?? undefined,
            bio: roleplayer?.bio ?? undefined,
        },
        validationSchema: yup.object<Roleplayer>().shape({
            fullname: yup.string().required('Roleplayer full name is required'),
            title: yup.string().required('Roleplayer title is required'),
            bio: yup.string(),
        }),
        onSubmit: values => {
            if (values.id) updateRoleplayer(values);
            else createRoleplayer(values);
        }
    });

    roleplayerModalStore.subscribe(state => {
        if (state.status == Status.OK) {
            toast({message: 'Roleplayer Saved', type: ToastType.SUCCESS})
            closeCallback(true);

            initRoleplayerModal();
        }
        if (state.status == Status.ERROR) {
            toast({message: 'Error Saving Roleplayer', type: ToastType.ERROR})
        }
    })
</script>

<Modal title={roleplayer?.id ? 'Edit Roleplayer' : 'Add Roleplayer'} bind:open={open} on:close={() => closeCallback(false)}>
    <form class="flex flex-col space-y-6" on:submit|preventDefault={handleSubmit}>

        <Label class="space-y-2">
            <span>Full Name</span>
            <Input on:change={handleChange} on:blur={handleChange} bind:value={$form.fullname} type="text" name="fullname" />
            {#if $errors.fullname}<Helper class="mt-2" color="red">{$errors.fullname}</Helper>{/if}
        </Label>

        <Label class="space-y-2">
            <span>Title</span>
            <Input on:change={handleChange} on:blur={handleChange} bind:value={$form.title} type="text" name="title" />
            {#if $errors.title}<Helper class="mt-2" color="red">{$errors.title}</Helper>{/if}
        </Label>

        <Label class="space-y-2">
            <span>Bio</span>
            <Input on:change={handleChange} on:blur={handleChange} bind:value={$form.bio} type="text" name="bio" />
            {#if $errors.bio}<Helper class="mt-2" color="red">{$errors.bio}</Helper>{/if}
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