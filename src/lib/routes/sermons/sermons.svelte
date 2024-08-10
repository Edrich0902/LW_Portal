<script lang="ts">
    import { Pagination, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from "flowbite-svelte";
    import { initSermons, pageSermons, sermonsStore } from "./sermons.store";
    import { Status, type Sermon } from "../../types";
    import { onMount } from "svelte";
    import { LwpLoader } from "../../components";
    import { formatDate } from "../../utils";

    $: ({ data, status, pagination, filter } = $sermonsStore);

    const tableColumns: string[] = [
        'Title',
        'Pastor',
        'Description',
        'Created At',
        'Updated At'
    ];

    onMount(() => {
        initSermons();
    });

    const selectSermon = (data: Sermon) => console.log('item clicked', data);

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
</script>

<svelte:head>
    <title>LWP | Sermons</title>
</svelte:head>

<div>
    {#if status == Status.LOADING}
        <LwpLoader message={"Loadig Sermons"} messageSize="xs" />
    {/if}

    {#if status == Status.OK}
        <Table striped hoverable>
            <TableHead>
                {#each tableColumns as column}
                    <TableHeadCell class="cursor-pointer">{column}</TableHeadCell>
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
</div>