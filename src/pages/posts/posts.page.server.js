
import { notion } from '../renderer/_default.page.server.js'
export { onBeforeRender }

async function onBeforeRender(pageContext) {
  
 const posts = notion.posts.pages.find(page => page.title.slugify() === pageContext.routeParams.Id)

  return {
    pageContext: {
      pageProps: {
        posts
      },
    }
  }
}