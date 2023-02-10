
import { notion } from '../renderer/_default.page.server.js'
export { onBeforeRender }

async function onBeforeRender(pageContext) {
  
 const street = notion.street.pages.find(page => page.title.slugify() === pageContext.routeParams.Id)

  return {
    pageContext: {
      pageProps: {
        street
      },
    }
  }
}