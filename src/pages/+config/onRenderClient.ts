import { createSSRApp, createApp, h } from "vue";

async function onRenderClient(pageContext) {
  const createAppFunc = document.getElementById("page")?.innerHTML === "" ? createApp : createSSRApp;
  const page = createAppFunc({ render: _ => h(pageContext.Page, pageContext?.pageProps || null) });
  page.mount("#page");
}

export default onRenderClient