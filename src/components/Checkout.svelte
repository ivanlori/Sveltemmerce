<script lang="ts">
	import Fa from 'svelte-fa/src/fa.svelte'
  import { scale } from "svelte/transition";
  import ProductCart from "./ProductCart.svelte";
  import PromoCode from "./PromoCode.svelte";
  import { cartContents, productsInCart, totalPrice } from "../store";
  import {
    faLongArrowAltRight,
    faTimes,
  } from "@fortawesome/free-solid-svg-icons";
  import { checkoutOpened } from "../store";
</script>

<div class="sidebar fixed" transition:scale>
  <div class="flex items-center justify-between">
    <h3 class="text-2xl font-medium text-gray-700">Your cart</h3>
    <button
      class="text-gray-600 focus:outline-none"
      on:click={() => checkoutOpened.update(() => false)}
    >
      <Fa icon={faTimes} />
    </button>
  </div>
  <hr class="my-3" />
  {#if $productsInCart === 0}
    Your cart is empty
  {:else}
    {#each $cartContents as content}
      <ProductCart
        id={content.id}
        title={content.title}
        img={content.img}
        price={content.price}
      />
    {/each}
  {/if}

  <div class="mt-8">
    <PromoCode />
  </div>
	<div class="mt-3">
		Total: {$totalPrice}
	</div>
  <div
    class="flex items-center justify-center mt-4 px-3 py-2 bg-blue-600 text-white text-sm uppercase font-medium rounded hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
  >
    <span>Checkout</span>
    <Fa icon={faLongArrowAltRight} />
  </div>
</div>

<style lang="postcss">
  .sidebar {
		@apply z-50;
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
