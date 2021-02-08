import svelte from 'vite-plugin-svelte'

const production = (process.env.NODE_ENV === 'production')

export default {
	plugins: [
		{
			...svelte({
				emitCss: false,
				compilerOptions: {
					dev: !production,
					hydratable: true
				}
			}),
			// Make our plugin handle resolveId before the vite internal resolver
			// This allows us to handle third-party svelte libraries
			enforce: 'pre'
		}
	],
	ssr: {
		noExternal: ['svelte-awesome']
	}
}
