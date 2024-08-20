<script lang="ts">
    import { Button, Pagination, Search, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from "flowbite-svelte";
    import { connectServeStore, filterConnectServeGroups, initConnectServe, pageConnectServeGroups, sortConnectServeGroups } from "./connectServe.store";
    import { onMount } from "svelte";
    import _ from "lodash";
    import ConnectServeModal from "./connectServeModal.svelte";
    import { Status, type Group } from "../../types";
    import { PlusOutline } from "flowbite-svelte-icons";
    import { LwpLoader } from "../../components";
    import { formatDate } from "../../utils";

    $: ({ data, status, pagination, filter, sort } = $connectServeStore );

    const tableColumns: {label: string, value: string}[] = [
        {label: 'Title', value: 'title'},
        {label:'Description', value: 'description'},
        {label:'Type', value: 'type'},
        {label:'Whatsapp', value: 'whatsappLink'},
        {label:'Location', value: 'location'},
        {label:'Created At', value: 'created_at'},
        {label:'Updated At', value: 'updated_at'},
    ];

    let searchText = "";
    let connectServeModal = false;
    let group: Group;

    onMount(() => {
        initConnectServe();
    });

    const selectConnectServeGroup = (data: Group) => {
        connectServeModal = true;
        group = data;
    }

    const newConnectServeGroup = () => {
        connectServeModal = true;
        group = {} as Group;
    }

    const closeCallback = (reload: boolean): void => {
        if (reload) initConnectServe();
        connectServeModal = false;
    }

    // pagination
    const previous = async () => {
        if (pagination.page == 0) return; // cannot return already on 1st page
        let newPage = pagination.page - 1;
        await pageConnectServeGroups({
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
        await pageConnectServeGroups({
            ...pagination,
            page: newPage,
            from: newPage * pagination.limit,
            to: (newPage * pagination.limit) + (pagination.limit - 1)
        });
    }

    const sortConnectServeGroupsIndex = async (column: string) => {
        if (sort.column == column) sort.order == 'asc' ? sort.order = 'desc' : sort.order = 'asc';
        await sortConnectServeGroups({column: column, order: sort.order});
    }

    const searchConnectServeGroups = _.debounce(async () => {
        if (searchText.trim()) await filterConnectServeGroups({searchText: searchText.trim()})
        else await initConnectServe();
    }, 200)
</script>

<svelte:head>
    <title>LWP | Connect & Serve</title>
</svelte:head>

<div>
    <div class="flex flex-row justify-between items-center gap-x-2">
        <Search on:input={searchConnectServeGroups} bind:value={searchText} size="sm" placeholder="Search Groups" />
        <Button size="sm" on:click={newConnectServeGroup}>
            <PlusOutline />
            Add
        </Button>
    </div>

    {#if status == Status.LOADING}
        <div class="py-4">
            <LwpLoader message={"Loadig Groups"} messageSize="xs" />
        </div>
    {/if}

    {#if status == Status.OK}
        <Table striped hoverable>
            <TableHead>
                {#each tableColumns as column}
                    <TableHeadCell class="cursor-pointer" on:click={() => sortConnectServeGroupsIndex(column.value)}>{column.label}</TableHeadCell>
                {/each}
            </TableHead>

            <TableBody>
                {#each data as group}
                    <TableBodyRow class="cursor-pointer" on:click={() => selectConnectServeGroup(group)}>
                        <TableBodyCell>{group.title}</TableBodyCell>
                        <TableBodyCell>{group.description}</TableBodyCell>
                        <TableBodyCell>{group.type}</TableBodyCell>
                        <TableBodyCell>{group.whatsappLink}</TableBodyCell>
                        <TableBodyCell>{group.location}</TableBodyCell>
                        <TableBodyCell>{formatDate(group.created_at ?? '')}</TableBodyCell>
                        <TableBodyCell>{formatDate(group.updated_at ?? '')}</TableBodyCell>
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
    {#key group}
        <!-- #key ensures rerender on group arg change -->
        <ConnectServeModal open={connectServeModal} {group} {closeCallback} />
    {/key}
</div>