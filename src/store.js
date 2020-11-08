import { writable } from "svelte/store";

export const system = writable({
  checkoutOpen: false,
});

export const productAdded = writable([]);
