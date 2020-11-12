<script lang="ts">
  import Icon from "fa-svelte";
  import { faShoppingCart, faBars } from "@fortawesome/free-solid-svg-icons";
  import { system } from "../store";
  import Logo from "./Logo.svelte";

  let isMenuMobileOpen: boolean = false;
</script>

<header>
  <div class="container mx-auto px-6 py-3">
    <div class="flex">
      <Logo width="300px" height="120px" />
    </div>
    <div class="flex items-center justify-between">
      <div class="hidden w-full text-gray-600 md:flex md:items-center" />
      <div class="w-full text-gray-700 md:text-center text-2xl font-semibold" />
      <div class="flex items-center justify-end w-full">
        <button
          class="text-gray-600 focus:outline-none mx-4 sm:mx-0"
          on:click={() => ($system.checkoutOpen = true)}>
          <Icon icon={faShoppingCart} />
        </button>
        <div class="flex sm:hidden">
          <button on:click={() => (isMenuMobileOpen = !isMenuMobileOpen)}>
            <Icon icon={faBars} />
          </button>
        </div>
      </div>
    </div>
    <nav class="{isMenuMobileOpen ? 'sm:flex' : 'hidden'} sm:flex mt-4">
      <div class="flex flex-col sm:flex-row">
        <a
          class="mt-3 text-gray-600 hover:underline sm:mx-3 sm:mt-0"
          href="#">Home</a>
        <a
          class="mt-3 text-gray-600 hover:underline sm:mx-3 sm:mt-0"
          href="#">Shop</a>
        <a
          class="mt-3 text-gray-600 hover:underline sm:mx-3 sm:mt-0"
          href="#">Categories</a>
        <a
          class="mt-3 text-gray-600 hover:underline sm:mx-3 sm:mt-0"
          href="#">Contact</a>
        <a
          class="mt-3 text-gray-600 hover:underline sm:mx-3 sm:mt-0"
          href="#">About</a>
      </div>
    </nav>
    <div class="relative mt-6 max-w-lg mx-auto">
      <span class="absolute inset-y-0 left-0 pl-3 flex items-center">
        <svg class="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </span>

      <input
        class="w-full border rounded-md pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none focus:shadow-outline"
        type="text"
        placeholder="Search" />
    </div>
  </div>
</header>
