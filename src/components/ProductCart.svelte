<script lang="ts">
  import Icon from "fa-svelte";
  import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
  import { cartContents, productsInCart } from "../store";

  export let id: number;
  export let img: string;
  export let name: string;
  export let price: number;

  let value = 1;

  function decrement() {
    return value > 1 ? value-- : value;
  }

  function removeFromCart(id: number) {
    productsInCart.update((items) => items - 1);

    cartContents.update((contents) => contents.filter((el) => el.id !== id));
  }
</script>

<div id={String(id)} class="flex justify-between mt-6">
  <img class="h-20 w-20 object-cover rounded" src={img} alt="" />
  <div class="mx-3 w-full">
    <div class="flex justify-between items-center">
      <h3 class="text-sm text-gray-600">{name}</h3>
      <button on:click={() => removeFromCart(id)}>
        <Icon icon={faMinus} />
      </button>
    </div>
    <div class="flex items-center mt-2">
      <button
        class="text-gray-500 focus:outline-none focus:text-gray-600"
        on:click={() => value++}
      >
        <Icon icon={faPlus} />
      </button>
      <span class="text-gray-700 mx-2">{value}</span>
      <button
        class="text-gray-500 focus:outline-none focus:text-gray-600"
        on:click={decrement}
      >
        <Icon icon={faMinus} />
      </button>
    </div>
    <div class="text-right">
      <span class="text-gray-600">{(price * value).toFixed(2)}€</span>
    </div>
  </div>
</div>
