import * as dotenv from 'dotenv'
import fs from 'fs'
import { Client } from "@notionhq/client"
// import NotionBlocksHtmlParser from '@notion-stuff/blocks-markdown-parser'
import { NotionBlocksHtmlParser } from '@notion-stuff/blocks-html-parser'
import { nanoid } from 'nanoid'
import _ from 'lodash'

Object.defineProperty(String.prototype, "slug", {
  get: function (separator = "-") {
    return this
      .toString()
      .normalize('NFD')                   // split an accented letter in the base letter and the acent
      .replace(/[\u0300-\u036f]/g, '')   // remove all previously split accents
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 ]/g, '')   // remove all chars not letters, numbers and spaces (to be replaced)
      .replace(/\s+/g, separator);
  }
}
)

Object.defineProperty(String.prototype, "route", {
  get: function (separator = "/") {
    return this.padStart(this.length + 1, separator)
  }
}
)

dotenv.config()

const markdownParser = NotionBlocksHtmlParser.getInstance()

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION,
})

// Order - fetch DB. For each DB entry, look for page property called sub-page
// if it has relations in that propertyy, fetch them (they are page ids)
// the lack of a relation reference to a parent page (page) is what qualifies something to be at the top level root

// recurive function for finding deeply nested routes

const isTopLevelDir = (block) => {
  return _.isEmpty(block.properties['parent-page'].relation)
}

const getBlockName = (block) => {
  return block.properties.name.title[0]?.plain_text;
}

const getAuthorData = async (page) => {
  const authorIds = page.properties?.Author?.people
  let authors;
  if (authorIds?.length) {
    authors = await Promise.all(
      authorIds.map(async (author) => await notion.users.retrieve({ user_id: author.id }))
    ).then(res => {
      if (res?.length) {
        return res.map(author => author.name)
      }
    })
  }
  return authors
}

const getPageContent = async (subPage) => {
  let page;
  if (subPage.object === 'page') {
    page = subPage
  } else {
    page = await notion.pages.retrieve({
      page_id: subPage.id
    })
  }

  const pageContent = await notion.blocks.children.list({
    block_id: subPage.id,
    page_size: 50,
  })

  const parsed = markdownParser.parse(pageContent.results)

  const coverImageRegex = /<figure notion-figure>[\s\S]+<img[^>]*src=['|"](https?:\/\/[^'|"]+)(?:['|"])/

  // Fall back to the first image in the page if one exists.

  const coverImage = page && page?.cover?.external?.url || page?.cover?.file.url || parsed.match(coverImageRegex)?.[1]


  return {
    name: getBlockName(page).slug,
    authors: await getAuthorData(page),
    coverImage,
    content: parsed
  }
}

const findKey = (object, key) => {
  let value;
  Object.keys(object).some(function (k) {
    if (k === key) {
      value = object[k];
      return true;
    }
    if (object[k] && typeof object[k] === 'object') {
      value = findKey(object[k], key);
      return value !== undefined;
    }
  });
  return value;
}

const siteData = {}

const fetchNotionData = async (dbId) => {
  const db = await notion.databases.query({
    database_id: dbId,
  });

  const pendingEntries = new Set()

  const findInPending = (entry, pendingEntries) => {
    let match
    pendingEntries.forEach(pendingEntry => {
      if (entry === pendingEntry.entry) {
        match = pendingEntry
      }
    })
    return match
  }

  const addSubPage = async (entry) => {
    const parent = entry.properties['parent-page'].relation[0]
    // how to avoid this async call? It causes the process to take quite a long time.
    const parentPage = await notion.pages.retrieve({ page_id: parent.id })
    const parentName = getBlockName(parentPage).slug.route
    const updateKey = findKey(siteData, parentName)

    if (updateKey) {
      const content = await getPageContent(entry)
      if (!updateKey[content.name.route]) updateKey[content.name.route] = content

      const match = findInPending(entry, pendingEntries)
      pendingEntries.delete(match)
    } else {
      let shouldAdd = true
      for (const pendingEntry of pendingEntries) {
        if (_.isEqual(entry, pendingEntry.entry)) {
          shouldAdd = false; break;
        };
      }
      if (shouldAdd) {
        pendingEntries.add({
          parentName,
          entry
        })
      }
    }
  }

  for await (const entry of db.results) {
    if (isTopLevelDir(entry)) {
      const content = await getPageContent(entry)
      const currentDir = siteData[getBlockName(entry).slug.route] = { ...content }
      if (entry.properties['sub-page'].relation.length) {
        for await (const subPage of entry.properties['sub-page'].relation) {
          const content = await getPageContent(subPage)
          currentDir[content.name.route] = content
        }
      }
    } else {
      await addSubPage(entry)
    }
  }
  while (pendingEntries.size) {
    console.log('trigger while', pendingEntries.size)
    for await (const pendingEntry of pendingEntries) {
      console.log(pendingEntry.parentName)
      await addSubPage(pendingEntry.entry)
      fs.writeFileSync('debug/site-date.json', JSON.stringify(siteData))
    }
  }
  console.log('complete')
  fs.writeFileSync('debug/site-date.json', JSON.stringify(siteData))
  return siteData
}

export default fetchNotionData

// fetchNotionData()