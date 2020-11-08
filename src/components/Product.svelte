<script lang="ts">
  import Icon from "fa-svelte";
  import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
  import { productAdded } from "../store";

  export let id: number;
  export let title: string;
  export let price: number;
  export let img: string;

  function addToBasket() {
    $productAdded.push({
      title,
      price,
      img,
      id,
      added: true,
    });

    // for reactivity -> https://svelte.dev/tutorial/updating-arrays-and-objects
    $productAdded = $productAdded;
  }
</script>

<div
  id={String(id)}
  class="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
  <div
    class="flex items-end justify-end h-56 w-full bg-cover"
    style="background-image: url({img})">
    <button
      class="p-2 rounded-full bg-blue-600 text-white mx-5 -mb-4 hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
      on:click={addToBasket}>
      <Icon icon={faShoppingCart} />
    </button>
  </div>
  <div class="px-5 py-3">
    <h3 class="text-gray-700 uppercase">{title}</h3>
    <span class="text-gray-500 mt-2">{price}$</span>
  </div>
</div>
