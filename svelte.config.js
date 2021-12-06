import preprocess from 'svelte-preprocess';
import static_adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess({
		defaults: {
			style: 'postcss'
		},
		postcss: true
	}),

	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		adapter: static_adapter(),
		// Comment the paths if wants to run in dev mode.		
		paths: {
			base: '/Sveltemmerce',
			assets: 'https://ivanlori.github.io/Sveltemmerce'
		}
	}
};

export default config;
