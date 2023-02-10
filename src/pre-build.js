import fs from 'fs'
import _ from 'lodash'
import { page_template, server_template } from './template.js'

// pull in the data source fetched from notion

// for each route cyclically go through and generate a page, server and route page for each, 
// building directories as we go until the structure is complete.
// if a directory with the route name exists, just don't make a new one or write over anything.
// This is a first time only generation because the idea is that this will be committed to git and worked on by humans, so 
// shouldn't step on their toes while still automating as much as possible.
// maybe there is a config option that defines the rules for how aggressive or gentle we are here.

const splitAt = (index, string) => [string.slice(0, index), string.slice(index)]

const prebuild = (routes) => {

  routes.forEach(route => {

    const splitIndex = _.lastIndexOf(route, '/')
    const splitRoute = splitAt(splitIndex, route)

    const routePath = route
    const routeName = splitRoute[1].substr(1)

    console.log(routeName, routePath)

    const pagePath = `./src/pages/${routePath}`

    // if (!fs.existsSync(pagePath)) {
    fs.mkdirSync(pagePath, { recursive: true })

    var compiledPage = _.template(page_template);
    var compiledServer = _.template(server_template);

    const cameledRouteName = _.camelCase(routeName);

    const interpolatedPage = compiledPage({ 'value': cameledRouteName });
    const interpolatedRoute = `export default '${routePath}/@${cameledRouteName}Id)'`
    const interpolatedServer = compiledServer({ 'value': cameledRouteName });

    const finalPagePath = `./src/pages/${routePath}/${routeName}.page.vue`
    const finalRoutePath = `./src/pages/${routePath}/${routeName}.page.route.js` // These need some figuring out...
    const finalServerPath = `./src/pages/${routePath}/${routeName}.page.server.js`

    fs.writeFileSync(finalPagePath, interpolatedPage)
    fs.writeFileSync(finalRoutePath, interpolatedRoute)
    fs.writeFileSync(finalServerPath, interpolatedServer)
    // }
  })
}

export default prebuild