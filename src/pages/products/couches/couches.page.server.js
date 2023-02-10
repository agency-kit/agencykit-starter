
import { notion } from '../renderer/_default.page.server.js'
export { onBeforeRender }

async function onBeforeRender(pageContext) {
  
 const couches = notion.couches.pages.find(page => page.title.slugify() === pageContext.routeParams.Id)

  return {
    pageContext: {
      pageProps: {
        couches
      },
    }
  }
}