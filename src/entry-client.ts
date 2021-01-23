import App from './App.svelte'

const app = new App({
  target: document.body,
  hydrate: true,
  props: {
    name: 'world'
  }
})

export default app
