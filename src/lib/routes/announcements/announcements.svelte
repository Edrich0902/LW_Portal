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
        TableHeadCell, Tooltip
    } from "flowbite-svelte";
    import {Status, type Announcement, AnnouncementState} from "../../types";
    import { onMount } from "svelte";
    import { LwpLoader } from "../../components";
    import { formatDate } from "../../utils";
    import _ from "lodash";
    import {
        CheckCircleSolid,
        ChevronDownOutline,
        CloseCircleSolid,
        PlusOutline,
        RefreshOutline
    } from "flowbite-svelte-icons";
    import {
        announcementsStore,
        filterAnnouncements,
        initAnnouncements,
        pageAnnouncements, sendAnnouncement,
        sortAnnouncements
    } from "./announcements.store";
    import {CldImage} from "svelte-cloudinary";
    import AnnouncementsModal from "./announcementsModal.svelte";
    import {LwpConfirmation} from "../../components/index.js";

    $: ({ data, status, pagination, filter, sort } = $announcementsStore);

    const tableColumns: {label: string, value: string, sortable?: boolean}[] = [
        {label: 'Image', value: 'image_public_id', sortable: true},
        {label: 'Sent', value: 'state', sortable: true},
        {label: 'Title', value: 'title', sortable: true},
        {label:'Created At', value: 'created_at', sortable: true},
        {label:'Updated At', value: 'updated_at', sortable: true},
        {label: '', value: '', sortable: false},
    ];

    let searchText = "";
    let announcementModal = false;
    let sendConfirmationModal = false;
    let announcement: Announcement;

    onMount(() => {
        initAnnouncements();
    });

    const selectAnnouncement = (data: Announcement) => {
        announcementModal = true;
        announcement = data;
    }

    const newAnnouncement = () => {
        announcementModal = true;
        announcement = {} as Announcement;
    }

    const closeCallback = (reload: boolean): void => {
        if (reload) initAnnouncements();
        announcementModal = false;
    }

    // pagination
    const previous = async () => {
        if (pagination.page == 0) return; // cannot return already on 1st page
        let newPage = pagination.page - 1;
        await pageAnnouncements({
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
        await pageAnnouncements({
            ...pagination,
            page: newPage,
            from: newPage * pagination.limit,
            to: (newPage * pagination.limit) + (pagination.limit - 1)
        });
    }

    const sortAnnouncementsIndex = async (column: string) => {
        if (sort.column == column) sort.order == 'asc' ? sort.order = 'desc' : sort.order = 'asc';
        await sortAnnouncements({column: column, order: sort.order});
    }

    const searchAnnouncements = _.debounce(async () => {
        if (searchText.trim()) await filterAnnouncements({searchText: searchText.trim()})
        else await initAnnouncements();
    }, 200)

    const confirmAnnouncementSend = (data: Announcement) => {
        event.stopPropagation();
        announcement = data;
        sendConfirmationModal = true;
    }

    const handleAnnouncementSend = async () => {
        await sendAnnouncement(announcement);
        announcement = {} as Announcement;
    }

    const refreshIndex = async () => await initAnnouncements();
</script>

<svelte:head>
    <title>LWP | Announcements</title>
</svelte:head>

<div>
    <div class="flex flex-row justify-between items-center gap-x-2">
        <Search on:input={searchAnnouncements} bind:value={searchText} size="sm" placeholder="Search Announcements" />
        <Button size="xs">Actions <ChevronDownOutline /></Button>
        <Dropdown>
            <DropdownItem on:click={newAnnouncement}>
                <div class="flex flex-row gap-1"><PlusOutline /> Add</div>
            </DropdownItem>
            <DropdownItem on:click={refreshIndex}>
                <div class="flex flex-row gap-1"><RefreshOutline /> Refresh Index</div>
            </DropdownItem>
        </Dropdown>
    </div>

    {#if status === Status.LOADING}
        <div class="py-4">
            <LwpLoader message={"Loading Announcements"} messageSize="xs" />
        </div>
    {/if}

    {#if status === Status.OK}
        <Table striped hoverable>
            <TableHead>
                {#each tableColumns as column}
                    <TableHeadCell class="cursor-pointer" on:click={() => column.sortable ? sortAnnouncementsIndex(column.value) : null}>{column.label}</TableHeadCell>
                {/each}
            </TableHead>

            <TableBody>
                {#each data as announcement}
                    <TableBodyRow class="cursor-pointer" on:click={() => selectAnnouncement(announcement)}>
                        <TableBodyCell>
                            <CldImage
                                    src={announcement?.image_public_id ?? "samples/cloudinary-icon"}
                                    loading="lazy"
                                    alt="Announcement Media"
                                    class="rounded-lg"
                                    height={50}
                                    width={50} />
                        </TableBodyCell>
                        <TableBodyCell>
                            <svelte:component
                                    this={announcement.state === AnnouncementState.SENT ? CheckCircleSolid : CloseCircleSolid}
                                    color={announcement.state === AnnouncementState.SENT ? "green" : "red"} />
                        </TableBodyCell>
                        <TableBodyCell>{announcement.title}</TableBodyCell>
                        <TableBodyCell>{formatDate(announcement.created_at ?? '')}</TableBodyCell>
                        <TableBodyCell>{formatDate(announcement.updated_at ?? '')}</TableBodyCell>
                        <TableBodyCell>
                            <Button disabled={announcement.state === AnnouncementState.SENT}
                                on:click={() => confirmAnnouncementSend(announcement)}>
                                {announcement.state === AnnouncementState.SENT ? 'Already Sent' : 'Send'}
                            </Button>
                            {#if announcement.state !== AnnouncementState.SENT}
                                <Tooltip>Send Announcement</Tooltip>
                            {/if}
                        </TableBodyCell>
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
    {#key announcement}
        <!-- #key ensures rerender on sermon arg change -->
        <AnnouncementsModal open={announcementModal} {announcement} {closeCallback} />
    {/key}

    <LwpConfirmation
        title="Send Announcement?"
        bind:open={sendConfirmationModal}
        confirm={handleAnnouncementSend}
    />
</div>