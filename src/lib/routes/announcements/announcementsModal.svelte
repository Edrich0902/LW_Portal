<script lang="ts">
    import {Button, Helper, Input, Label, Modal, Select, Spinner, Textarea} from "flowbite-svelte";
    import {createForm} from "svelte-forms-lib";
    import {type Announcement, AnnouncementState, type Group, Status, ToastType} from "../../types";
    import * as yup from "yup";
    import {toast} from "../../components";
    import {CldImage, CldUploadWidget} from "svelte-cloudinary";
    import {
        announcementModalStore,
        createAnnouncement,
        initAnnouncementModal,
        updateAnnouncement,
        updateAnnouncementImage
    } from "./announcementsModal.store";

    export let open: boolean = false;
    export let announcement: Announcement;
    export let closeCallback: (reload: boolean) => void;

    $: ({ status } = $announcementModalStore);

    const { form, errors, handleChange, handleSubmit } = createForm<Announcement>({
        initialValues: {
            id: announcement?.id ?? undefined,
            title: announcement?.title ?? undefined,
            body: announcement?.body ?? undefined,
            state: announcement?.state ?? AnnouncementState.PENDING
        },
        validationSchema: yup.object<Group>().shape({
            title: yup.string().required('Title is required'),
            body: yup.string().required('Body is required'),
        }),
        onSubmit: values => {
            if (values.id) updateAnnouncement(values);
            else createAnnouncement(values);
        }
    });

    announcementModalStore.subscribe(state => {
        if (state.status == Status.OK) {
            toast({message: 'Announcement Saved', type: ToastType.SUCCESS});
            closeCallback(true);

            initAnnouncementModal();
        }
        if (state.status == Status.ERROR) {
            toast({message: 'Error Saving Announcement', type: ToastType.ERROR});
        }
    });

    const handleUploadSuccess = async (results: any) => {
        announcement.image_public_id = results.info.public_id;
        announcement.image_url = results.info.url;
        const uploadSuccess = await updateAnnouncementImage(announcement);
        if (uploadSuccess) toast({message: 'Image updated', type: ToastType.SUCCESS});
    }

    const handleUploadError = (error: string) => {
        console.error('Cloudinary upload error', error);
        toast({message: 'Error Uploading Image', type: ToastType.ERROR});
    }
</script>

<Modal title={announcement?.id ? 'Edit Announcement' : 'Add Announcement'} bind:open={open} on:close={() => closeCallback(false)}>
    <div class="flex flex-col justify-center items-center space-y-6">
        <CldImage
                src={announcement?.image_public_id ?? "samples/cloudinary-icon"}
                loading="lazy"
                alt="Image"
                class="rounded-lg"
                height={250}
                width={350} />

        <CldUploadWidget
                uploadPreset={import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET}
                onSuccess={handleUploadSuccess}
                onError={handleUploadError}
                let:open
                let:isLoading>
            <Button on:click={() => open()} disabled={isLoading}>
                Upload Image
            </Button>
        </CldUploadWidget>
    </div>
    <form class="flex flex-col space-y-6" on:submit|preventDefault={handleSubmit}>

        <Label class="space-y-2">
            <span>Title</span>
            <Input on:change={handleChange} on:blur={handleChange} bind:value={$form.title} type="text" name="title" />
            {#if $errors.title}<Helper class="mt-2" color="red">{$errors.title}</Helper>{/if}
        </Label>

        <Label class="space-y-2">
            <span>Body</span>
            <Textarea on:change={handleChange} on:blur={handleChange} bind:value={$form.body} rows="4" name="body"/>
            {#if $errors.body}<Helper class="mt-2" color="red">{$errors.body}</Helper>{/if}
        </Label>

        <div class="flex flex-row justify-end items-center">
            <Button on:click={() => closeCallback(false)} color="none">Cancel</Button>
            <Button type="submit">
                {#if status === Status.LOADING}
                    <Spinner class="me-3" size="4" color="white" />
                {/if}
                Save
            </Button>
        </div>
    </form>
</Modal>