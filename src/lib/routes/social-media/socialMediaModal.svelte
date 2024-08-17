<script lang="ts">
    import { Button, Helper, Input, Label, Modal, Select, Spinner } from "flowbite-svelte";
    import { createForm } from "svelte-forms-lib";
    import { SocialMediaType, Status, ToastType, type SocialMedia } from "../../types";
    import { createSocialMedia, initSocialMediaModal, socialMediaModalStore, updateSocialMedia } from "./socialMediaModal.store";
    import * as yup from "yup";
    import { toast } from "../../components";

    export let open: boolean = false;
    export let socialMedia: SocialMedia;
    export let closeCallback: (reload: boolean) => void;

    $: ({ status } = $socialMediaModalStore);

    const socialMediaTypes = Object.values(SocialMediaType) as string[];

    const { form, errors, handleChange, handleSubmit } = createForm<SocialMedia>({
        initialValues: {
            id: socialMedia?.id ?? undefined,
            title: socialMedia?.title ?? undefined,
            link: socialMedia?.link ?? undefined,
            type: socialMedia?.type ?? undefined,
        },
        validationSchema: yup.object<SocialMedia>().shape({
            title: yup.string().required('Social Media Title is required'),
            link: yup.string().required('Social Media Link is required'),
            type: yup.string().required('Social Media Type is required')
        }),
        onSubmit: values => {
            if (values.id) updateSocialMedia(values);
            else createSocialMedia(values);
        }
    });

    socialMediaModalStore.subscribe(state => {
        if (state.status == Status.OK) {
            toast({ message: 'Social Media Saved', type: ToastType.SUCCESS });
            closeCallback(true);

            initSocialMediaModal();
        }
        if (state.status == Status.ERROR) {
            toast({message: 'Error Saving Social Media', type: ToastType.ERROR})
        }
    });
</script>

<Modal title={socialMedia?.id ? 'Edit Social Media' : 'Add Social Media'} bind:open={open} on:close={() => closeCallback(false)}>
    <form class="flex flex-col space-y-6" on:submit|preventDefault={handleSubmit}>

        <Label class="space-y-2">
            <span>Title</span>
            <Input on:change={handleChange} on:blur={handleChange} bind:value={$form.title} type="text" name="title" />
            {#if $errors.title}<Helper class="mt-2" color="red">{$errors.title}</Helper>{/if}
        </Label>

        <Label class="space-y-2">
            <span>Link</span>
            <Input on:change={handleChange} on:blur={handleChange} bind:value={$form.link} type="text" name="link" />
            {#if $errors.link}<Helper class="mt-2" color="red">{$errors.link}</Helper>{/if}
        </Label>

        <Label class="space-y-2">
            <span>Type</span>
            <Select on:change={handleChange} on:blur={handleChange} bind:value={$form.type} name="type">
                {#each socialMediaTypes as socialType}
                    <option value={socialType}>{socialType}</option>
                {/each}
            </Select>
            {#if $errors.type}<Helper class="mt-2" color="red">{$errors.type}</Helper>{/if}
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