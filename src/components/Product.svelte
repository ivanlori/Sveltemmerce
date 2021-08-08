<script lang="ts">
  import Fa from 'svelte-fa/src/fa.svelte'
  import { faMinus, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
  import { cartContents, productsInCart } from "../store";

  export let id: number;
  export let title: string;
  export let price: number;
  export let img: string;

  function addToBasket(id: number) {
    productsInCart.update((items) => items + 1);

    cartContents.update((contents) => [
      ...contents,
      {
        title,
        price,
        img,
        id,
      },
    ]);
  }

  function removeFromBasket(id: number) {
    productsInCart.update((items) => items - 1);

    cartContents.update((contents) => contents.filter((el) => el.id !== id));
  }
</script>

<div
  id={String(id)}
  class="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden"
>
  <div
    class="flex items-end justify-end h-56 w-full bg-cover"
    style="background-image: url({img})"
  />
  <div class="px-5 py-3">
    <h3 class="text-gray-700">{title}</h3>
    <span class="text-gray-500 mt-2">{price}$</span>
  </div>
  {#if $cartContents.find((el) => el.id === id)}
    <button class="btn remove" on:click={() => removeFromBasket(id)}>
      <Fa icon={faMinus} />
      Remove from Cart
    </button>
  {:else}
    <button class="btn" on:click={() => addToBasket(id)}>
      <Fa icon={faShoppingCart} />
      Add to Cart
    </button>
  {/if}
</div>

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
