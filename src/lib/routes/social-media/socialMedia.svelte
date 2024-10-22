<script lang="ts">
    import { Button, Pagination, Search, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from "flowbite-svelte";
    import { filterSocialMedia, initSocialMedia, pageSocialMedia, socialMediaStore, sortSocialMedia } from "./socialMedia.store";
    import { Status, type SocialMedia } from "../../types";
    import { onMount } from "svelte";
    import _ from "lodash";
    import { PlusOutline } from "flowbite-svelte-icons";
    import { LwpLoader } from "../../components";
    import { formatDate } from "../../utils";
    import SocialMediaModal from "./socialMediaModal.svelte";
    import { CldImage } from "svelte-cloudinary";

    $: ({ data, status, pagination, filter, sort } = $socialMediaStore);

    const tableColumns: {label: string, value: string}[] = [
        {label:'Banner', value: 'banner_public_id'},
        {label:'Title', value: 'title'},
        {label:'Link', value: 'link'},
        {label:'Type', value: 'type'},
        {label:'Created At', value: 'created_at'},
        {label:'Updated At', value: 'updated_at'},
    ];

    let searchText = "";
    let socialMediaModal = false;
    let socialMedia: SocialMedia;

    onMount(() => {
        initSocialMedia();
    });

    const selectSocialMedia = (data: SocialMedia) => {
        socialMediaModal = true;
        socialMedia = data;
    }

    const newSocialMedia = () => {
        socialMediaModal = true;
        socialMedia = {} as SocialMedia;
    }

    const closeCallback = (reload: boolean): void => {
        if (reload) initSocialMedia();
        socialMediaModal = false;
    }

    // pagination
    const previous = async () => {
        if (pagination.page == 0) return; // cannot return already on 1st page
        let newPage = pagination.page - 1;
        await pageSocialMedia({
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
        await pageSocialMedia({
            ...pagination,
            page: newPage,
            from: newPage * pagination.limit,
            to: (newPage * pagination.limit) + (pagination.limit - 1)
        });
    }

    const sortSocialMediaIndex = async (column: string) => {
        if (sort.column == column) sort.order == 'asc' ? sort.order = 'desc' : sort.order = 'asc';
        await sortSocialMedia({column: column, order: sort.order});
    }

    const searchSocialMedia = _.debounce(async () => {
        if (searchText.trim()) await filterSocialMedia({searchText: searchText.trim()})
        else await initSocialMedia();
    }, 200)
</script>

<svelte:head>
    <title>LWP | Social Media</title>
</svelte:head>

<div>
    <div class="flex flex-row justify-between items-center gap-x-2">
        <Search on:input={searchSocialMedia} bind:value={searchText} size="sm" placeholder="Search Social Media" />
        <Button size="sm" on:click={newSocialMedia}>
            <PlusOutline />
            Add
        </Button>
    </div>

    {#if status == Status.LOADING}
        <div class="py-4">
            <LwpLoader message={"Loadig Social Media"} messageSize="xs" />
        </div>
    {/if}

    {#if status == Status.OK}
        <Table striped hoverable>
            <TableHead>
                {#each tableColumns as column}
                    <TableHeadCell class="cursor-pointer" on:click={() => sortSocialMediaIndex(column.value)}>{column.label}</TableHeadCell>
                {/each}
            </TableHead>

            <TableBody>
                {#each data as socialMedia}
                    <TableBodyRow class="cursor-pointer" on:click={() => selectSocialMedia(socialMedia)}>
                        <TableBodyCell>
                            <CldImage
                                src={socialMedia?.banner_public_id ?? "samples/cloudinary-icon"}
                                loading="lazy"
                                alt="Banner"
                                class="rounded-lg"
                                height={50}
                                width={50} />
                        </TableBodyCell>
                        <TableBodyCell>{socialMedia.title}</TableBodyCell>
                        <TableBodyCell>{socialMedia.link}</TableBodyCell>
                        <TableBodyCell>{socialMedia.type}</TableBodyCell>
                        <TableBodyCell>{formatDate(socialMedia.created_at ?? '')}</TableBodyCell>
                        <TableBodyCell>{formatDate(socialMedia.updated_at ?? '')}</TableBodyCell>
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
    {#key socialMedia}
        <!-- #key ensures rerender on socialMedia arg change -->
        <SocialMediaModal open={socialMediaModal} {socialMedia} {closeCallback} />
    {/key}
</div>