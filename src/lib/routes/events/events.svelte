<script lang="ts">
    import {
        Button,
        Dropdown, DropdownItem,
        Pagination,
        Search,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell
    } from "flowbite-svelte";
    import { onMount } from "svelte";
    import { Status, type Event } from "../../types";
    import { eventStore, filterEvents, initEvents, pageEvents, sortEvents } from "./events.store";
    import _ from "lodash";
    import {ChevronDownOutline, PlusOutline, RefreshOutline} from "flowbite-svelte-icons";
    import { LwpLoader } from "../../components";
    import { formatDate, formatTime } from "../../utils";
    import EventsModal from "./eventsModal.svelte";
    import { CldImage } from "svelte-cloudinary";

    $: ({ data, status, pagination, filter, sort } = $eventStore);

    const tableColumns: {label: string, value: string}[] = [
        {label: 'Banner',       value: 'banner_public_id' },
        {label: 'Title',        value: 'title'},
        {label: 'Description',  value: 'description'},
        {label: 'Category',     value: 'category'},
        {label: 'Type',         value: 'type'},
        {label: 'Day',          value: 'day'},
        {label: 'Time',         value: 'time'},
        {label: 'Created At',   value: 'created_at'},
        {label: 'Updated At',   value: 'updated_at'},
    ];

    let searchText = "";
    let eventModal = false;
    let event: Event;

    onMount(() => {
        initEvents();
    });

    const selectEvent = (data: Event) => {
        eventModal = true;
        event = data;
    }

    const newEvent = () => {
        eventModal = true;
        event = {} as Event;
    }

    const closeCallback = (reload: boolean): void => {
        if (reload) initEvents();
        eventModal = false;
    }

    // pagination
    const previous = async () => {
        if (pagination.page == 0) return; // cannot return already on 1st page
        let newPage = pagination.page - 1;
        await pageEvents({
            ...pagination,
            page: newPage,
            from: newPage * pagination.limit,
            to: (newPage * pagination.limit) + (pagination.limit - 1)
        });
    }

    const next = async () => {
        if (pagination.page == 0) {
            if ((pagination.page + 1) * pagination.limit >= pagination.count) return; // cannot return already on last page
        }
        if (pagination.page * pagination.limit >= pagination.count) return; // cannot return already on last page
        let newPage = pagination.page + 1;
        await pageEvents({
            ...pagination,
            page: newPage,
            from: newPage * pagination.limit,
            to: (newPage * pagination.limit) + (pagination.limit - 1)
        });
    }

    const sortEventsIndex = async (column: string) => {
        if (sort.column == column) sort.order == 'asc' ? sort.order = 'desc' : sort.order = 'asc';
        await sortEvents({column: column, order: sort.order});
    }

    const searchEvents = _.debounce(async () => {
        if (searchText.trim()) await filterEvents({searchText: searchText.trim()})
        else await initEvents();
    }, 200)

    const refreshIndex = async () => await initEvents();
</script>

<svelte:head>
    <title>LWP | Events</title>
</svelte:head>

<div>
    <div class="flex flex-row justify-between items-center gap-x-2">
        <Search on:input={searchEvents} bind:value={searchText} size="sm" placeholder="Search Events" />
        <Button size="xs">Actions <ChevronDownOutline /></Button>
        <Dropdown>
            <DropdownItem on:click={newEvent}>
                <div class="flex flex-row gap-1"><PlusOutline /> Add</div>
            </DropdownItem>
            <DropdownItem on:click={refreshIndex}>
                <div class="flex flex-row gap-1"><RefreshOutline /> Refresh Index</div>
            </DropdownItem>
        </Dropdown>
    </div>

    {#if status == Status.LOADING}
        <div class="py-4">
            <LwpLoader message={"Loadig Events"} messageSize="xs" />
        </div>
    {/if}

    {#if status == Status.OK}
        <Table striped hoverable>
            <TableHead>
                {#each tableColumns as column}
                    <TableHeadCell class="cursor-pointer" on:click={() => sortEventsIndex(column.value)}>{column.label}</TableHeadCell>
                {/each}
            </TableHead>

            <TableBody>
                {#each data as event}
                    <TableBodyRow class="cursor-pointer" on:click={() => selectEvent(event)}>
                        <TableBodyCell>
                            <CldImage
                                src={event?.banner_public_id ?? "samples/cloudinary-icon"}
                                loading="lazy"
                                alt="Event Banner"
                                class="rounded-lg"
                                height={50}
                                width={50} />
                        </TableBodyCell>
                        <TableBodyCell>{event.title}</TableBodyCell>
                        <TableBodyCell>{event.description}</TableBodyCell>
                        <TableBodyCell>{event.category ?? 'N/A'}</TableBodyCell>
                        <TableBodyCell>{event.type}</TableBodyCell>
                        <TableBodyCell>{event.day}</TableBodyCell>
                        <TableBodyCell>{formatTime(event.time)}</TableBodyCell>
                        <TableBodyCell>{formatDate(event.created_at ?? '')}</TableBodyCell>
                        <TableBodyCell>{formatDate(event.updated_at ?? '')}</TableBodyCell>
                    </TableBodyRow>
                {/each}
            </TableBody>
        </Table>

        <div class="flex flex-col items-center justify-center mt-4 gap-y-2">
            <div class="flex flex-col items-center justify-center gap-2">
                <div class="text-sm text-gray-700 dark:text-gray-400">
                    Showing <span class="font-semibold text-gray-900 dark:text-white">{pagination.from + 1}</span>
                    to
                    <span class="font-semibold text-gray-900 dark:text-white">{pagination.to}</span>
                    of
                    <span class="font-semibold text-gray-900 dark:text-white">{pagination.count}</span>
                    Entries
                </div>
            </div>
            <Pagination table on:next={next} on:previous={previous} />
        </div>
    {/if}

    <!-- Create & Edit Modal -->
    {#key event}
        <!-- #key ensures rerender on event arg change -->
        <EventsModal open={eventModal} {event} {closeCallback} />
    {/key}
</div>