// @ts-check
import fs from 'fs';
import express from 'express';
import compression from 'compression';
import serveStatic from 'serve-static';
import vite from 'vite';

const isProd = process.env.NODE_ENV === 'production'

const indexProd = isProd
  ? fs.readFileSync('dist/client/index.html', 'utf-8')
  : ''

const manifest = isProd
  ? JSON.parse(fs.readFileSync('dist/client/ssr-manifest.json', 'utf8'))
  : {}

function getIndexTemplate(url) {
  if (isProd) {
    return indexProd
  }

  // during dev, inject vite client + always read fresh index.html
  return (
    `<script type="module" src="/@vite/client"></script>` +
    fs.readFileSync('index.html', 'utf-8')
  )
}

async function startServer() {
  const app = express()

  /**
   * @type {vite.ViteDevServer}
   */
  let viteDevServer;

  if (isProd) {
    app.use(compression())
    app.use(serveStatic('dist/client', { index: false }))
  } else {
    viteDevServer = await vite.createServer({
      server: {
        middlewareMode: true
      }
    })
    // use vite's connect instance as middleware
    app.use(viteDevServer.middlewares)
  }

  app.use('*', async (req, res, next) => {
    try {
      const { render } = isProd
        ? await import('./dist/server/entry-server.js')
        : await viteDevServer.ssrLoadModule('/src/entry-server.ts')

      const rendered = await render(req.originalUrl, manifest)
      const head = `<style>${rendered.css.code}</style>`;

      const html = getIndexTemplate(req.originalUrl).replace(`<!--ssr-body-->`, rendered.html).replace(`<!--ssr-head-->`, head)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      !isProd && viteDevServer.ssrFixStacktrace(e)
      console.log(e.stack)
      next(e)
    }
  })

  app.listen(3000, () => {
    console.log('http://localhost:3000')
  })
}

startServer()
