<script lang="ts">
    import { Button, Pagination, Search, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from "flowbite-svelte";
    import { onMount } from "svelte";
    import { filterUsers, initUsers, pageUsers, sortUsers, usersStore } from "./users.store";
    import _ from "lodash";
    import { Status } from "../../types";
    import { LwpLoader } from "../../components";
    import { formatDate } from "../../utils";
    import { CheckCircleSolid, CloseCircleSolid } from "flowbite-svelte-icons";



    $: ({ data, status, pagination, filter, sort } = $usersStore);

    const tableColumns: {label: string, value: string}[] = [
        {label: 'First Name', value: 'first_name'},
        {label: 'Last Name', value: 'last_name'},
        {label: 'Email', value: 'email'},
        {label: 'Role', value: 'role'},
        {label: 'Baptised', value: 'is_baptised'},
        {label: 'Member', value: 'is_member'},
        {label: 'Address', value: 'address'},
        {label:'Created At', value: 'created_at'},
        {label:'Updated At', value: 'updated_at'},
    ];

    let searchText = "";

    onMount(() => {
        initUsers();
    })

    // pagination
    const previous = async () => {
        if (pagination.page == 0) return; // cannot return already on 1st page
        let newPage = pagination.page - 1;
        await pageUsers({
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
        await pageUsers({
            ...pagination,
            page: newPage,
            from: newPage * pagination.limit,
            to: (newPage * pagination.limit) + (pagination.limit - 1)
        });
    }

    const sortUsersIndex = async (column: string) => {
        if (sort.column == column) sort.order == 'asc' ? sort.order = 'desc' : sort.order = 'asc';
        await sortUsers({column: column, order: sort.order});
    }

    const searchUsers = _.debounce(async () => {
        if (searchText.trim()) await filterUsers({searchText: searchText.trim()})
        else await initUsers();
    }, 200)
</script>

<svelte:head>
    <title>LWP | Users</title>
</svelte:head>

<div>
    <div class="flex flex-row justify-between items-center gap-x-2">
        <Search on:input={searchUsers} bind:value={searchText} size="sm" placeholder="Search Users" />
    </div>

    {#if status == Status.LOADING}
        <div class="py-4">
            <LwpLoader message={"Loadig Users"} messageSize="xs" />
        </div>
    {/if}

    {#if status == Status.OK}
        <Table striped hoverable>
            <TableHead>
                {#each tableColumns as column}
                    <TableHeadCell class="cursor-pointer" on:click={() => sortUsersIndex(column.value)}>{column.label}</TableHeadCell>
                {/each}
            </TableHead>

            <TableBody>
                {#each data as user}
                    <TableBodyRow class="cursor-pointer">
                        <TableBodyCell>{user?.first_name ?? 'N/A'}</TableBodyCell>
                        <TableBodyCell>{user?.last_name ?? 'N/A'}</TableBodyCell>
                        <TableBodyCell>{user.email}</TableBodyCell>
                        <TableBodyCell>{user.role}</TableBodyCell>
                        <TableBodyCell>
                            <svelte:component
                                this={user?.is_baptized ? CheckCircleSolid : CloseCircleSolid}
                                color={user?.is_baptized ? "green" : "red"} />
                        </TableBodyCell>
                        <TableBodyCell>
                            <svelte:component
                                this={user?.is_member ? CheckCircleSolid : CloseCircleSolid}
                                color={user?.is_baptized ? "green" : "red"} />
                        </TableBodyCell>
                        <TableBodyCell>{user?.address ?? 'N/A'}</TableBodyCell>
                        <TableBodyCell>{formatDate(user?.created_at ?? '')}</TableBodyCell>
                        <TableBodyCell>{formatDate(user?.updated_at ?? '')}</TableBodyCell>
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