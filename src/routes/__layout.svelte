<script lang="ts">
	import Checkout from "./../components/Checkout.svelte";
	import Header from "./../components/Header.svelte";
	import Logo from "./../components/Logo.svelte";
	import { checkoutOpened } from "./../store";
</script>

<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>

<Header />
  {#if $checkoutOpened}
    <Checkout />
  {/if}
<main>
	<slot></slot>
</main>
<footer class="bg-gray-200">
	<div class="container mx-auto px-6 py-3 flex justify-between items-center">
		<Logo width="150px" height="80px" />
		<p class="py-2 text-gray-500 sm:py-0">Made with ❤️</p>
	</div>
</footer>