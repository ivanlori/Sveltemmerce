module.exports = {
	mode: 'jit',
	purge: [
		'./src/**/*.svelte',
		// may also want to include HTML files
		'./src/**/*.html'
	],
	darkMode: 'class',
	theme: {
		extend: {}
	},
	variants: {},
	plugins: []
};
