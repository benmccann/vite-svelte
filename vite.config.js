import svelte from 'rollup-plugin-svelte'

const production = (process.env.NODE_ENV === 'production')

export default {
  plugins: [
    svelte({
      emitCss: false,
      compilerOptions: {
        dev: !production,
      }
    })
  ]
}
