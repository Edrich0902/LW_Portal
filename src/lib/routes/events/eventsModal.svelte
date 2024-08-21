<script lang="ts">
    import { Button, Helper, Input, Label, Modal, Select, Spinner, Textarea } from "flowbite-svelte";
    import { createForm } from "svelte-forms-lib";
    import { EventType, Status, ToastType, Weekday, type Event } from "../../types";
    import { createEvent, eventModalStore, initEventModal, updateEvent } from "./eventsModal.store";
    import * as yup from "yup";
    import { toast } from "../../components";
    import { formatDate, formatTime } from "../../utils";

    export let open: boolean = false;
    export let event: Event;
    export let closeCallback: (reload: boolean) => void;

    $: ({ status } = $eventModalStore);

    const eventTypes = Object.values(EventType) as string[];
    const weekdays = Object.values(Weekday) as string[];

    const { form, errors, handleChange, handleSubmit } = createForm<Event>({
        initialValues: {
            id: event?.id ?? undefined,
            title: event?.title ?? undefined,
            description: event?.description ?? undefined,
            start_date: event?.start_date ? formatDate(event?.start_date, 'YYYY-MM-DD') : undefined,
            end_date: event?.end_date ? formatDate(event?.end_date, 'YYYY-MM-DD') : undefined,
            time: formatTime(event?.time) ?? undefined,
            type: event?.type ?? undefined,
            day: event?.day ?? undefined,
        },
        validationSchema: yup.object<Event>().shape({
            title: yup.string().required('Title is required'),
            description: yup.string().required('Description is required'),
            start_date: yup.date().required('Start date is required'),
            end_date: yup.date(),
            time: yup.string().required('Time is required'),
            type: yup.string().required('Type is required'),
            day: yup.string(),
        }),
        onSubmit: values => {
            if (values.id) updateEvent(values);
            else createEvent(values);
        }
    });

    eventModalStore.subscribe(state => {
        if (state.status == Status.OK) {
            toast({message: 'Event Saved', type: ToastType.SUCCESS});
            closeCallback(true);

            initEventModal();
        }
        if (state.status == Status.ERROR) {
            toast({message: 'Error Saving Event', type: ToastType.ERROR});
        }
    });
</script>

<Modal title={event?.id ? 'Edit Event' : 'Add Event'} bind:open={open} on:close={() => closeCallback(false)}>
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
                {#each eventTypes as eventType}
                    <option value={eventType}>{eventType}</option>
                {/each}
            </Select>
            {#if $errors.type}<Helper class="mt-2" color="red">{$errors.type}</Helper>{/if}
        </Label>

        <Label class="space-y-2">
            <span>Start Date</span>
            <Input on:change={handleChange} on:blur={handleChange} bind:value={$form.start_date} type="date" name="start_date" />
            {#if $errors.start_date}<Helper class="mt-2" color="red">{$errors.start_date}</Helper>{/if}
        </Label>

        <Label class="space-y-2">
            <span>End Date</span>
            <Input on:change={handleChange} on:blur={handleChange} bind:value={$form.end_date} type="date" name="end_date" />
            {#if $errors.end_date}<Helper class="mt-2" color="red">{$errors.end_date}</Helper>{/if}
        </Label>

        <Label class="space-y-2">
            <span>Time</span>
            <Input on:change={handleChange} on:blur={handleChange} bind:value={$form.time} type="time" name="time" />
            {#if $errors.time}<Helper class="mt-2" color="red">{$errors.time}</Helper>{/if}
        </Label>

        <Label class="space-y-2">
            <span>Weekday</span>
            <Select on:change={handleChange} on:blur={handleChange} bind:value={$form.day} name="day">
                {#each weekdays as day}
                    <option value={day}>{day}</option>
                {/each}
            </Select>
            {#if $errors.day}<Helper class="mt-2" color="red">{$errors.day}</Helper>{/if}
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