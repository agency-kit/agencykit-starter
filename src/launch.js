import fetchNotionData from "./notion-cms.js";
import prebuild from "./pre-build.js";
import _ from 'lodash'

import siteData from '../debug/site-date.json' assert {type: 'json'}

const dbId = 'df3f51f5-daa7-4d28-90da-ece89281778d'

const genRoutes = (directory) => {
  // directory in form of entrie: ['/route', {}]
  const results = []
  const routePart = directory[0]
  const routeChildren = _(directory[1]).pickBy((value, key) => _.startsWith(key, '/')).entries().value()
  if (!routeChildren.length) return [routePart]
  routeChildren.forEach(childDirectory => {
    const childRes = genRoutes(childDirectory)
    if (childRes.length) {
      childRes.forEach(res => results.push(routePart + res))
    } else {
      results.push(routePart + childRes)
    }
  })
  results.push(routePart)
  return results
}


// const notion = await fetchNotionData(dbId)
const notion = siteData

let routes = []
const tlds = Object.entries(notion)
tlds.forEach(tld => {
  routes.push(genRoutes(tld))
})
console.log(routes.flat(), 'routes')
routes = routes.flat()
prebuild(routes)

// TODO add posts/ services etc page server route