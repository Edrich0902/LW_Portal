<script lang="ts">
    import { Button, Heading, Hr, Input, Label, Spinner, Textarea } from "flowbite-svelte";
    import { initVisionMission, updateVisionMission, visionMissionStore } from "./visionMission.store";
    import { createForm } from "svelte-forms-lib";
    import type { VisionMission } from "../../types";
    import { onMount } from "svelte";
    import { Status, ToastType } from "../../types";
    import { LwpLoader, toast } from "../../components";

    $: ({ data, status } = $visionMissionStore);

    // TODO: figure out how to get validation working in form array

    type VisionMissionForm<T> = {
        items: T[];
    }

    const visionMissionTitleMap: { [key: string]: string; } = {
        vision_statement: 'Vision Statement',
        mission_statement: 'Mission Statement',
    }

    const resetForm = () => initVisionMission();

    const { form, handleChange, handleSubmit } = createForm<VisionMissionForm<VisionMission>>({
        initialValues: {
            items: data ?? [],
        },
        onSubmit: values => {
            updateVisionMission(values.items)
            if (status == Status.OK) toast({ message: "Vision & Mission Updated", type: ToastType.SUCCESS });
        }
    });

    onMount(() => {
        initVisionMission();
    });

    visionMissionStore.subscribe(state => {
        if (state.status == Status.OK) form.set({items: state.data}); // set form on state complete
    });
</script>

<svelte:head>
    <title>LWP | Vision & Mission</title>
</svelte:head>

<div>
    {#if status == Status.LOADING}
        <div class="py-4">
            <LwpLoader message={"Loadig Vision & Mission"} messageSize="xs" />
        </div>
    {/if}

    <form class="flex flex-col gap-y-2" on:submit|preventDefault={handleSubmit}>
        {#if status == Status.OK}
            {#each $form.items as item, i}
                <Heading tag="h6">{visionMissionTitleMap[item.key]}</Heading>

                <Label class="space-y-2">
                    <span>Title</span>
                    <Input on:change={handleChange} on:blur={handleChange} bind:value={$form.items[i].title}/>
                </Label>

                <Label class="space-y-2">
                    <span>Content</span>
                    <Textarea
                        on:change={handleChange}
                        on:blur={handleChange}
                        bind:value={$form.items[i].content}
                        rows="6"/>
                </Label>

                {#if i < 1}<Hr />{/if}
            {/each}
        {/if}

        <div class="mt-2 flex flex-row gap-x-2 justify-end items-center">
            <Button on:click={resetForm} color="none" class="text-gray-400">Cancel</Button>
            <Button type="submit">
                {#if status == Status.LOADING}
                    <Spinner class="me-3" size="4" color="white" />
                {/if}
                Save
            </Button>
        </div>
    </form>
</div>