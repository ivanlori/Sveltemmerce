import { writable, derived } from "svelte/store";

export const productsInCart = writable(0);
export const cartContents = writable([]);
export const checkoutOpened = writable(false);

export const totalPrice = derived(
  productsInCart,
  ($productsInCart) => $productsInCart * $cartContents.price
);
