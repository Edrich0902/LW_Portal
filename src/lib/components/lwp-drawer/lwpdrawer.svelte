<script lang="ts">
    import { Sidebar, SidebarGroup, SidebarWrapper, SidebarItem, DarkMode, SidebarBrand, Hr, SidebarDropdownWrapper, SidebarDropdownItem } from "flowbite-svelte";
    import { ArrowLeftToBracketOutline, ChartPieSolid, FolderSolid, UsersGroupSolid } from "flowbite-svelte-icons";
    import { supabaseSignOut } from "../../services/auth-service";
    import { navigate } from "svelte-routing";
    import { onMount } from "svelte";

    let activeUrl = "/dashboard"; // dashboard is active by default

    let activeClass = "flex items-center p-2 text-base font-normal text-primary-900 bg-primary-200 dark:bg-primary-700 rounded-lg dark:text-white hover:bg-primary-100 dark:hover:bg-gray-700";
    let dropdownActiveClass = "flex items-center p-2 ps-11 text-base font-normal text-primary-900 bg-primary-200 dark:bg-primary-700 rounded-lg dark:text-white hover:bg-primary-100 dark:hover:bg-gray-700"
    let divClass = "overflow-y-auto py-4 px-3 bg-gray-50 rounded-lg dark:bg-gray-800 shadow-md w-64"

    let site = {
        name: "LWP Admin",
        href: '/dashboard',
        img: '../../../lwp_icon.png'
    }

    const logout = async (event: any) => {
        event.preventDefault();

        const response = await supabaseSignOut();
        if (response.success) navigate("/", {replace: true});
    }

    onMount(() => {
        /*
            Due to race conditions and rendering the active route is not correctly set on mount
            Set timeout prevents the incorrect active route being set
        */
        setTimeout(() => {
            activeUrl = window.location.pathname;
        }, 100);
    });
</script>

<Sidebar {activeUrl} {activeClass}>
    <SidebarWrapper {divClass}>
        <SidebarGroup>
            <div class="flex flex-row justify-between items-center">
                <SidebarBrand {site} aClass="flex items-center ps-2.5" />
                <DarkMode />
            </div>

            <Hr />

            <SidebarItem label="Dashboard" href="/dashboard">
                <svelte:fragment slot="icon">
                    <ChartPieSolid />
                </svelte:fragment>
            </SidebarItem>

            <SidebarItem label="Users" href="/users">
                <svelte:fragment slot="icon">
                    <UsersGroupSolid />
                </svelte:fragment>
            </SidebarItem>

            <SidebarDropdownWrapper label="Content Mangement">
                <svelte:fragment slot="icon">
                    <FolderSolid />
                </svelte:fragment>

                <SidebarDropdownItem label="Sermons" href="/sermons" active={activeUrl == '/sermons'} activeClass={dropdownActiveClass} />
                <SidebarDropdownItem label="Vision & Mission" href="/vision-mission" active={activeUrl == '/vision-mission'} activeClass={dropdownActiveClass} />
                <SidebarDropdownItem label="Roleplayers" href="/roleplayers" active={activeUrl == '/roleplayers'} activeClass={dropdownActiveClass} />
                <SidebarDropdownItem label="Events" href="/events" active={activeUrl == '/events'} activeClass={dropdownActiveClass} />
                <SidebarDropdownItem label="Social Media" href="/social-media" active={activeUrl == '/social-media'} activeClass={dropdownActiveClass} />
                <SidebarDropdownItem label="Connect & Serve" href="/connect-serve" active={activeUrl == '/connect-serve'} activeClass={dropdownActiveClass} />

            </SidebarDropdownWrapper>

        </SidebarGroup>

        <SidebarGroup border>
            <SidebarItem label="Logout" on:click={logout}>
                <svelte:fragment slot="icon">
                    <ArrowLeftToBracketOutline />
                </svelte:fragment>
            </SidebarItem>
        </SidebarGroup>
    </SidebarWrapper>
</Sidebar>