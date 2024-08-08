<script lang="ts">
    import { slide } from "svelte/transition";
    import { toasts } from "./lwptoast.store";
    import { Toast } from "flowbite-svelte";
    import { ToastType } from "../../types";
    import { InfoCircleSolid, ExclamationCircleSolid, CheckCircleSolid } from "flowbite-svelte-icons";

    const resolveToastColor = (type: ToastType | undefined) => {
      if (!type) return "none";
      if (type === ToastType.ERROR) return "red";
      if (type === ToastType.INFO) return "none";
      if (type === ToastType.SUCCESS) return "green";
    }

    const resolveToastIcon = (type: ToastType | undefined) => {
      if (!type) return InfoCircleSolid;
      if (type === ToastType.ERROR) return ExclamationCircleSolid;
      if (type === ToastType.INFO) return InfoCircleSolid;
      if (type === ToastType.SUCCESS) return CheckCircleSolid;
    }
  </script>

  {#if $toasts}
    {#each $toasts as toast}
      <Toast
        class="z-50"
        color={resolveToastColor(toast.type)}
        simple
        transition={slide}
        position={toast.position ? toast.position : "bottom-left"}>

        <svelte:fragment slot="icon">
          <svelte:component this={resolveToastIcon(toast.type)} />
        </svelte:fragment>

        <!-- Toast Message -->
        {toast.message}
      </Toast>
    {/each}
  {/if}