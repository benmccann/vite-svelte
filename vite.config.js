import svelte from 'rollup-plugin-svelte'

const production = (process.env.NODE_ENV === 'production')

// TODO: this is hacky
const ssr = JSON.stringify(process.env).includes('--ssr');

export default {
  plugins: [
    svelte({
      emitCss: false,
      compilerOptions: {
        dev: !production,
        generate: ssr ? 'ssr' : 'dom'
      }
    })
  ],
  optimizeDeps: {
  	exclude: ['svelte']
  }
}
