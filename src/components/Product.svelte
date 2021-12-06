<script lang="ts">
	import ButtonActions from "./ButtonActions.svelte";

  export let id: number;
  export let title: string;
  export let price: number;
  export let img: string;

	const dataProduct = {
		id,
		title,
		price,
		img
	}
</script>

<a class="z-10 relative" href={`/${id}`} title={`Product ${id}`}>
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
		<ButtonActions {...dataProduct}/>
	</div>
</a>
