<script lang="ts">
  import ItemCart from "./ItemCart.svelte";
  import PromoCode from "./PromoCode.svelte";
  import { system } from "../store";
  import Icon from "fa-svelte";
  import {
    faLongArrowAltRight,
    faTimes,
  } from "@fortawesome/free-solid-svg-icons";
  import { productAdded } from "../store";
</script>

<style>
  .sidebar {
    @apply right-0;
    @apply top-0;
    @apply max-w-xs;
    @apply w-full;
    @apply h-full;
    @apply px-6;
    @apply py-4;
    @apply transition;
    @apply duration-300;
    @apply transform;
    @apply overflow-y-auto;
    @apply bg-white;
    @apply border-l-2;
    @apply border-gray-300;
  }
</style>

<div class="sidebar fixed">
  <div class="flex items-center justify-between">
    <h3 class="text-2xl font-medium text-gray-700">Your cart</h3>
    <button
      class="text-gray-600 focus:outline-none"
      on:click={() => ($system.checkoutOpen = false)}>
      <Icon icon={faTimes} />
    </button>
  </div>
  <hr class="my-3" />
  {#if $productAdded.length === 0}
    Your cart is empty
  {:else}
    {#each $productAdded as product}
      {#if product.added}
        <ItemCart
          id={product.id}
          name={product.title}
          img="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1189&q=80"
          price={product.price} />
      {/if}
    {/each}
  {/if}

  <div class="mt-8">
    <PromoCode />
  </div>
  <div
    class="flex items-center justify-center mt-4 px-3 py-2 bg-blue-600 text-white text-sm uppercase font-medium rounded hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
    <span>Checkout</span>
    <Icon icon={faLongArrowAltRight} />
  </div>
</div>
