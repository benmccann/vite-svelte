import App from './App.svelte'

export async function render(
  url: string,
  manifest: Manifest
): Promise<[string, string]> {

  return App.render({
    name: 'world'
  });
}
