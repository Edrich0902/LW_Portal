<script lang="ts">
    import { Card, Label, Input, Button, DarkMode, Helper, Spinner } from "flowbite-svelte";
    import { createForm } from "svelte-forms-lib";
    import * as yup from "yup";
    import { authenticate, authStore } from "./auth.store";
    import { Status, ToastType } from "../../types";
    import { navigate } from "svelte-routing";
    import { toast } from "../../components";
    import {supabase} from "../../../supabaseClient";

    $: ({ status, response } = $authStore);

    const isAdmin = async (userId: string): Promise<boolean> => {
        const response = await supabase.from('user_profile_view').select('role').eq('id', userId).single<{role: string}>();
        return response.data?.role === 'super_admin';
    }

    authStore.subscribe(async (value) => {
        if (value.response.success && value.response.message) {
            const sessionResponse = await supabase.auth.getSession()
            if (!sessionResponse.data.session) return;

            if (!await isAdmin(sessionResponse.data.session.user.id)) {
                toast({message: "Only Admin Users Allowed", type: ToastType.ERROR});
                await supabase.auth.signOut(); // auto sign out user if not admin
                return;
            }

            toast({message: value.response.message, type: ToastType.SUCCESS});
            navigate("/dashboard", {replace: true})
        } else if (!value.response.success && value.response.message) {
            toast({message: value.response.message, type: ToastType.ERROR});
        }
    });

    const { form, errors, handleChange, handleSubmit } = createForm({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: yup.object().shape({
            email: yup.string().email('Your email is not valid').required('Please provide your email'),
            password: yup.string().required('Your password is required')
        }),
        onSubmit: values => authenticate(values.email, values.password),
    });

</script>

<svelte:head>
    <title>LWP | Login</title>
</svelte:head>

<div class="flex flex-col items-center justify-center px-6 py-8 mx-auto my-auto">
    <div class="flex items-center mb-6 text-2xl font-semibold text-primary-900 dark:text-white">
        <img class="w-10 h-10 mr-2 rounded-full" src="/lwp_icon.png" alt="LWP Logo" />
        LWP Admin
    </div>
    <Card>
        <form class="flex flex-col space-y-6" on:submit|preventDefault={handleSubmit}>
            <div class="flex justify-between items-center">
                <h3 class="text-xl font-medium text-primary-900 dark:text-white">Sign in to your account</h3>
                <DarkMode />
            </div>

            <Label class="space-y-2">
                <span>Email</span>
                <Input on:change={handleChange} on:blur={handleChange} bind:value={$form.email} type="email" name="email" placeholder="example@example.com" />
                {#if $errors.email}<Helper class="mt-2" color="red">{$errors.email}</Helper>{/if}
            </Label>

            <Label class="space-y-2">
                <span>Password</span>
                <Input on:change={handleChange} on:blur={handleChange} bind:value={$form.password} type="password" name="password" placeholder="******" />
                {#if $errors.password}<Helper class="mt-2" color="red">{$errors.password}</Helper>{/if}
            </Label>

            {#if response.success == false && response.message}
                <Helper class="my-2" color="red">{response.message}</Helper>
            {/if}

            <Button type="submit" class="w-full">
                {#if status == Status.LOADING}
                    <Spinner class="me-3" size="4" color="white" />
                {/if}
                Login
            </Button>
        </form>
    </Card>
</div>