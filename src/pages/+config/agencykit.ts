import NotionCMS from '@agency-kit/notion-cms'
import dotenv from 'dotenv'
import { createSSRApp, createApp, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { escapeInject, dangerouslySkipEscape } from "vite-plugin-ssr";

dotenv.config()

const notion = new NotionCMS({
  databaseId: 'e4fcd5b3-1d6a-4afd-b951-10d56ce436ad',
  notionAPIKey: process.env.NOTION_API
})

await notion.fetch()

async function onBeforeRender(pageContext) {
  // TODO: replace _findByKey with a proper helper in @agency-kit/notion-cms
  const page = notion._findByKey(notion.cms.siteData, pageContext.urlOriginal)
  return {
    pageContext: {
      pageProps: {
        page
      }
    }
  }
}

async function onRenderHtml(pageContext) {
  const page = createSSRApp({ render: _ => h(pageContext.Page, pageContext?.pageProps || null) });
  const pageHtml = pageContext.Page ? dangerouslySkipEscape(await renderToString(page)) : "";
  return escapeInject`<html><body><div id="page">${pageHtml}</div></body></html>`;
}

function prerender() {

}

// We only need this for pre-rendered apps https://vite-plugin-ssr.com/pre-rendering
function onPrerenderStart(prerenderContext) {
  const pageContexts = [] as any[]
  notion.routes.forEach(route => {
    // Duplicate pageContext for each locale

    // Need to populate with page context for each route for this to prerender all routes
      pageContexts.push({
        route,
      })
    })

  return {
    prerenderContext: {
      pageContexts
    }
  }
}

export {onRenderHtml, onBeforeRender, onPrerenderStart}