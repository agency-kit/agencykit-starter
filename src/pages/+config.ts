export default {
  prerender: true,
  onPrerenderStart: './+config/onPrerenderStart.ts',
  onBeforeRender: './+config/onBeforeRender.ts',
  onRenderClient: './+config/onRenderClient.ts',
  onRenderHtml: './+config/onRenderHtml.ts',
  passToClient: ['pageProps']
}