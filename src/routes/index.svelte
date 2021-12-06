<script lang="ts">
	import { base } from '$app/paths';
  import Product from "./../components/Product.svelte";
  import data from "../../products_mock.json";

  let productSearched: string = "";

  $: filteredList = data.filter((el) => {
    return el.title.toLowerCase().includes(productSearched.toLowerCase());
  });
</script>

<svelte:head>
	<link rel="stylesheet" href="{base}/global.css">
</svelte:head>

<div class="relative max-w-lg mx-auto">
	<span class="absolute inset-y-0 left-0 pl-3 flex items-center">
		<svg class="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none">
			<path
				d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	</span>
	<input
		class="search"
		type="text"
		placeholder="Search"
		bind:value={productSearched}
	/>
</div>
<div class="container mx-auto mt-5">
	<h3 class="text-gray-700 text-2xl font-medium">Our Products</h3>
	<div
		class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6"
	>
		{#each filteredList as { price, title, id, img }}
			<Product
				{id}
				{price}
				{title}
				img={img}
			/>
		{/each}
	</div>
	<div class="flex justify-center">
		<div class="flex rounded-md mt-8">
			<a href="/" class="prev-next"><span>Previous</span></a>
			<a href="/" class="num"><span>1</span></a>
			<a href="/" class="num"><span>2</span></a>
			<a href="/" class="num"><span>3</span></a>
			<a href="/" class="prev-next"><span>Next</span></a>
		</div>
	</div>
</div>

<style lang="postcss">

  .search {
    @apply border;
    @apply rounded-md;
    @apply p-2;
    @apply w-full;
    @apply pl-10;
    @apply pr-4;
  }

	.search:focus {
      @apply border-blue-500;
      @apply outline-none;
      @apply shadow-outline;
    }

  .prev-next {
    @apply py-2;
    @apply px-4;
    @apply leading-tight;
    @apply bg-white;
    @apply border;
    @apply border-gray-200;
    @apply text-blue-700;
    @apply border-r-0;
    @apply ml-0;
    @apply rounded-l;
  }

  .prev-next:hover {
    @apply bg-blue-500;
    @apply text-white;
  }

  .num {
    @apply py-2;
    @apply px-4;
    @apply leading-tight;
    @apply bg-white;
    @apply border;
    @apply border-gray-200;
    @apply text-blue-700;
    @apply border-r-0;
  }

  .num:hover {
    @apply bg-blue-500;
    @apply text-white;
  }
</style>
