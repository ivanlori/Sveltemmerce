<script lang="ts">
  import Header from "./components/Header.svelte";
  import Checkout from "./components/Checkout.svelte";
  import Product from "./components/Product.svelte";
  import Logo from "./components/Logo.svelte";
  import data from "../products_mock.json";
  import { checkoutOpened } from "./store";

  let valueSearched: string = "";
  const products = data;
  let productSearched = [];

  function searchProduct() {
    const filtered = products.filter((el) => {
      return el.title.includes(valueSearched);
    });

    productSearched = [...filtered];
  }
</script>

<div>
  <Header />
  {#if $checkoutOpened}
    <Checkout />
  {/if}
  <main>
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
        bind:value={valueSearched}
        on:keyup={searchProduct}
      />
    </div>
    <div class="container mx-auto mt-5">
      <h3 class="text-gray-700 text-2xl font-medium">Our Products</h3>
      <div
        class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6"
      >
        {#if valueSearched}
          {#each productSearched as { price, title }, i}
            <Product
              id={i}
              {price}
              {title}
              img={"https://loremflickr.com/320/240"}
            />
          {/each}
        {:else}
          {#each products as { price, title }, i}
            <Product
              id={i}
              {price}
              {title}
              img={"https://loremflickr.com/320/240"}
            />
          {/each}
        {/if}
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
  </main>

  <footer class="bg-gray-200">
    <div class="container mx-auto px-6 py-3 flex justify-between items-center">
      <Logo width="150px" height="80px" />
      <p class="py-2 text-gray-500 sm:py-0">Made with ❤️</p>
    </div>
  </footer>
</div>

<style lang="scss">
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
    @apply my-8;
  }

  .search {
    @apply border;
    @apply rounded-md;
    @apply p-2;
    @apply w-full;
    @apply pl-10;
    @apply pr-4;
    &:focus {
      @apply border-blue-500;
      @apply outline-none;
      @apply shadow-outline;
    }
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

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
