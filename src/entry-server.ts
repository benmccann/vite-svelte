import App from './App.svelte'

export async function render(
  url: string,
  manifest: Manifest
): Promise<[string, string]> {

  const { head, html, css } = App.render({
    answer: 42
  })

  return [html, ''];
}
