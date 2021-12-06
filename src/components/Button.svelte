<script lang="ts">
	import { faMinus, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
	import Fa from 'svelte-fa/src/fa.svelte';

	export let className: string;
	export let onClick: () => void;
	export let text: string;
	export let remove: boolean;
</script>

<button class={`btn ${className}`} on:click|preventDefault={onClick}>
	{#if remove}
	<Fa icon={faMinus} />
	{:else}
	<Fa icon={faShoppingCart} />
	{/if}
	{text}
</button>

<style lang="scss">
  .btn {
    @apply p-2;
    @apply rounded-full;
    @apply bg-blue-500;
    @apply text-white;
    @apply w-full;
		@apply flex;
		@apply justify-center;
		@apply items-center;
		@apply z-10;

    &.remove {
      @apply bg-red-500;
    }
  }

  .btn:hover {
    @apply bg-blue-600;

    &.remove {
      @apply bg-red-600;
    }
  }

  .btn:focus {
    @apply outline-none;
    @apply bg-blue-500;
  }
</style>