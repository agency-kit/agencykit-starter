export const page_template = `
<script setup>
import Post from '../layouts/post.vue';
const props = defineProps(['<%= value %>'])
</script>

<template>
  {{props.<%= value %>}}
</template>
`


export const server_template = `
import { notion } from '../renderer/_default.page.server.js'
export { onBeforeRender }

async function onBeforeRender(pageContext) {
  
 const <%= value %> = notion.<%= value %>.pages.find(page => page.title.slugify() === pageContext.routeParams.Id)

  return {
    pageContext: {
      pageProps: {
        <%= value %>
      },
    }
  }
}`


export const route_template = `export default <%= value %>`