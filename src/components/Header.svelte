<script lang="ts">
  import Icon from "fa-svelte";
  import { faShoppingCart, faBars } from "@fortawesome/free-solid-svg-icons";
  import { productsInCart, checkoutOpened } from "../store";
  import Logo from "./Logo.svelte";

  let isMenuMobileOpen: boolean = false;
</script>

<header>
  <div class="container mx-auto px-6 py-3">
    <div class="flex justify-between">
      <div class="w-1/2 flex items-center">
        <Logo width="300px" height="120px" />
      </div>
      <nav
        class="w-1/2 {isMenuMobileOpen
          ? 'sm:flex'
          : 'hidden'} sm:flex items-center justify-end"
      >
        <div class="flex flex-col sm:flex-row">
          <a class="menu sm:mx-3 sm:mt-0" href="/">Home</a>
          <a class="menu sm:mx-3 sm:mt-0" href="/">Shop</a>
          <a class="menu sm:mx-3 sm:mt-0" href="/">Categories</a>
          <a class="menu sm:mx-3 sm:mt-0" href="/">Contact</a>
          <a class="menu sm:mx-3 sm:mt-0" href="/">About</a>
          <button
            class="mt-3 text-gray-600 focus:outline-none"
            on:click={() => checkoutOpened.update(() => true)}
          >
            <Icon icon={faShoppingCart} />
            {#if $productsInCart}
              <span class="bg-blue-400 text-white p-2">{$productsInCart}</span>
            {/if}
          </button>
        </div>
      </nav>
      <div class="flex sm:hidden">
        <button on:click={() => (isMenuMobileOpen = !isMenuMobileOpen)}>
          <Icon icon={faBars} />
        </button>
      </div>
    </div>
  </div>
</header>

<style>
  .menu {
    @apply mt-3;
    @apply text-gray-600;
  }

  .menu:hover {
    @apply underline;
  }
</style>
