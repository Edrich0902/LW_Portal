<script lang="ts">
    import { Button, Pagination, Search, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from "flowbite-svelte";
    import { filterSermons, initSermons, pageSermons, sermonsStore, sortSermons } from "./sermons.store";
    import { Status, type Sermon } from "../../types";
    import { onMount } from "svelte";
    import { LwpLoader } from "../../components";
    import { formatDate } from "../../utils";
    import _ from "lodash";
    import { PlusOutline } from "flowbite-svelte-icons";
    import SermonModal from "./sermonModal.svelte";

    $: ({ data, status, pagination, filter, sort } = $sermonsStore);

    const tableColumns: {label: string, value: string}[] = [
        {label: 'Title', value: 'title'},
        {label:'Pastor', value: 'pastor'},
        {label:'Description', value: 'description'},
        {label:'Created At', value: 'created_at'},
        {label:'Updated At', value: 'updated_at'},
    ];

    let searchText = "";
    let sermonModal = false;
    let sermon: Sermon;

    onMount(() => {
        initSermons();
    });

    const selectSermon = (data: Sermon) => {
        sermonModal = true;
        sermon = data;
    }

    const newSermon = () => {
        sermonModal = true;
        sermon = {} as Sermon;
    }

    const closeCallback = (reload: boolean): void => {
        if (reload) initSermons();
        sermonModal = false;
    }

    // pagination
    const previous = async () => {
        if (pagination.page == 0) return; // cannot return already on 1st page
        let newPage = pagination.page - 1;
        await pageSermons({
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
        await pageSermons({
            ...pagination,
            page: newPage,
            from: newPage * pagination.limit,
            to: (newPage * pagination.limit) + (pagination.limit - 1)
        });
    }

    const sortSermonsIndex = async (column: string) => {
        if (sort.column == column) sort.order == 'asc' ? sort.order = 'desc' : sort.order = 'asc';
        await sortSermons({column: column, order: sort.order});
    }

    const searchSermons = _.debounce(async () => {
        if (searchText.trim()) await filterSermons({searchText: searchText.trim()})
        else await initSermons();
    }, 200)
</script>

<svelte:head>
    <title>LWP | Sermons</title>
</svelte:head>

<div>
    <div class="flex flex-row justify-between items-center gap-x-2">
        <Search on:input={searchSermons} bind:value={searchText} size="sm" placeholder="Search Sermons" />
        <Button size="sm" on:click={newSermon}>
            <PlusOutline />
            Add
        </Button>
    </div>

    {#if status == Status.LOADING}
        <div class="py-4">
            <LwpLoader message={"Loadig Sermons"} messageSize="xs" />
        </div>
    {/if}

    {#if status == Status.OK}
        <Table striped hoverable>
            <TableHead>
                {#each tableColumns as column}
                    <TableHeadCell class="cursor-pointer" on:click={() => sortSermonsIndex(column.value)}>{column.label}</TableHeadCell>
                {/each}
            </TableHead>

            <TableBody>
                {#each data as sermon}
                    <TableBodyRow class="cursor-pointer" on:click={() => selectSermon(sermon)}>
                        <TableBodyCell>{sermon.title}</TableBodyCell>
                        <TableBodyCell>{sermon.pastor}</TableBodyCell>
                        <TableBodyCell>{sermon.description ?? 'N/A'}</TableBodyCell>
                        <TableBodyCell>{formatDate(sermon.created_at ?? '')}</TableBodyCell>
                        <TableBodyCell>{formatDate(sermon.updated_at ?? '')}</TableBodyCell>
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
    <SermonModal open={sermonModal} {sermon} {closeCallback} />
</div>