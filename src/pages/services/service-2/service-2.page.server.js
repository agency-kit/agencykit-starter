
import { notion } from '../renderer/_default.page.server.js'
export { onBeforeRender }

async function onBeforeRender(pageContext) {
  
 const service2 = notion.service2.pages.find(page => page.title.slugify() === pageContext.routeParams.Id)

  return {
    pageContext: {
      pageProps: {
        service2
      },
    }
  }
}