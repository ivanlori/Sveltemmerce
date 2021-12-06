<script lang="ts">
	import { cartContents, productsInCart } from "../store";
	import Button from '../components/Button.svelte';

	export let id: number;
  export let title: string;
  export let price: number;
  export let img: string;
	
	function addToBasket(id: number) {
		// increments the number on shopping cart icon
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
		// decrements the number on shopping cart icon
    productsInCart.update((items) => items - 1);

    cartContents.update((contents) => contents.filter((el) => el.id !== id));
  }
</script>

<div>
	{#if $cartContents.find((el) => el.id === id)}
		<Button
			className="remove"
			onClick={() => removeFromBasket(id)}
			remove={true}
			text="Remove from Cart"
		/>
		{:else}
		<Button
			className=""
			onClick={() => addToBasket(id)}
			remove={false}
			text="Add to Cart"
		/>
		{/if}
</div>