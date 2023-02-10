
import { notion } from '../renderer/_default.page.server.js'
export { onBeforeRender }

async function onBeforeRender(pageContext) {
  
 const medium = notion.medium.pages.find(page => page.title.slugify() === pageContext.routeParams.Id)

  return {
    pageContext: {
      pageProps: {
        medium
      },
    }
  }
}