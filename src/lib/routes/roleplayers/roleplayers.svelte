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
    import { type Roleplayer, Status } from "../../types";
    import { filterRoleplayers, initRoleplayers, pageRoleplayers, roleplayersStore, sortRoleplayers } from "./roleplayers.store";
    import {ChevronDownOutline, PlusOutline, RefreshOutline} from "flowbite-svelte-icons";
    import { LwpLoader } from "../../components";
    import { formatDate } from "../../utils";
    import _ from "lodash";
    import RoleplayerModal from "./roleplayerModal.svelte";
    import { CldImage } from "svelte-cloudinary";

    $: ({ data, status, pagination, filter, sort } = $roleplayersStore);

    const tableColumns: {label: string, value: string}[] = [
        {label: 'Profile Image', value: 'profile_public_id'},
        {label:'Fullname', value: 'fullname'},
        {label: 'Title', value: 'title'},
        {label:'Created At', value: 'created_at'},
        {label:'Updated At', value: 'updated_at'},
    ];

    let searchText = "";
    let roleplayerModal = false;
    let roleplayer: Roleplayer;

    onMount(() => {
        initRoleplayers();
    });

    const selectRoleplayer = (data: Roleplayer) => {
        roleplayerModal = true;
        roleplayer = data;
    }

    const newRoleplayer = () => {
        roleplayerModal = true;
        roleplayer = {} as Roleplayer;
    }

    const closeCallback = (reload: boolean): void => {
        if (reload) initRoleplayers();
        roleplayerModal = false;
    }

    // pagination
    const previous = async () => {
        if (pagination.page == 0) return; // cannot return already on 1st page
        let newPage = pagination.page - 1;
        await pageRoleplayers({
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
        await pageRoleplayers({
            ...pagination,
            page: newPage,
            from: newPage * pagination.limit,
            to: (newPage * pagination.limit) + (pagination.limit - 1)
        });
    }

    const sortRoleplayersIndex = async (column: string) => {
        if (sort.column == column) sort.order == 'asc' ? sort.order = 'desc' : sort.order = 'asc';
        await sortRoleplayers({column: column, order: sort.order});
    }

    const searchRoleplayers = _.debounce(async () => {
        if (searchText.trim()) await filterRoleplayers({searchText: searchText.trim()})
        else await initRoleplayers();
    }, 200)

    const refreshIndex = async () => await initRoleplayers();
</script>

<svelte:head>
    <title>LWP | Roleplayers</title>
</svelte:head>

<div>
    <div class="flex flex-row justify-between items-center gap-x-2">
        <Search on:input={searchRoleplayers} bind:value={searchText} size="sm" placeholder="Search Roleplayers" />
        <Button size="xs">Actions <ChevronDownOutline /></Button>
        <Dropdown>
            <DropdownItem on:click={newRoleplayer}>
                <div class="flex flex-row gap-1"><PlusOutline /> Add</div>
            </DropdownItem>
            <DropdownItem on:click={refreshIndex}>
                <div class="flex flex-row gap-1"><RefreshOutline /> Refresh Index</div>
            </DropdownItem>
        </Dropdown>
    </div>

    {#if status == Status.LOADING}
        <div class="py-4">
            <LwpLoader message={"Loadig Roleplayers"} messageSize="xs" />
        </div>
    {/if}

    {#if status == Status.OK}
        <Table striped hoverable>
            <TableHead>
                {#each tableColumns as column}
                    <TableHeadCell class="cursor-pointer" on:click={() => sortRoleplayersIndex(column.value)}>{column.label}</TableHeadCell>
                {/each}
            </TableHead>

            <TableBody>
                {#each data as roleplayer}
                    <TableBodyRow class="cursor-pointer" on:click={() => selectRoleplayer(roleplayer)}>
                        <TableBodyCell>
                            <CldImage
                                src={roleplayer?.profile_public_id ?? "samples/cloudinary-icon"}
                                loading="lazy"
                                alt="Profile Picture"
                                class="rounded-full"
                                height={50}
                                width={50} />
                        </TableBodyCell>
                        <TableBodyCell>{roleplayer.fullname}</TableBodyCell>
                        <TableBodyCell>{roleplayer.title}</TableBodyCell>
                        <TableBodyCell>{formatDate(roleplayer.created_at ?? '')}</TableBodyCell>
                        <TableBodyCell>{formatDate(roleplayer.updated_at ?? '')}</TableBodyCell>
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
    {#key roleplayer}
        <!-- #key ensures rerender on roleplayer arg change -->
        <RoleplayerModal open={roleplayerModal} {roleplayer} {closeCallback} />
    {/key}
</div>