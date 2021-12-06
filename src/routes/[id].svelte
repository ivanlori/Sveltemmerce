<script context="module">
	import data from '../../products_mock.json';

  export async function load(context) {
		
    const id = context.page.params.id;
		const product = data.find((el) => {
			return el.id === Number(id);
		});

		return {
			props: {product}
		}
  }
</script>

<script>
	import ButtonActions from "./../components/ButtonActions.svelte";

	export let product;
</script>

<div class="wrapper">
	<img
		src={product.img}
		alt={`Product ${product.id}`}
	/>
	<div class="content">
		<div class="flex flex-col justify-start items-baseline">
			<h1 class="text-lg font-normal mb-0 text-gray-600 font-sans">
				{product.title}
			</h1>
		</div>
		<p class="text-base text-gray-500">
			{product.description}
		</p>
		<div class="w-full flex justify-between items-center">
			<h2 class="font-bold text-gray-500">{product.price}€</h2>
			<ButtonActions id={product.id}/>
		</div>
	</div>
</div>

<style lang="postcss">
	img {
		@apply max-w-lg;
	}
	.wrapper {
		@apply bg-white;
		@apply shadow-md;
		@apply rounded-3xl;
		@apply items-center;
		@apply overflow-hidden;
		@apply flex;
	}

	.content {
		@apply flex-1;
		@apply w-full;
		@apply flex;
		@apply flex-col;
		@apply items-baseline;
		@apply justify-around;
		@apply p-5;
	}
</style>
