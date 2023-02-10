

  return await Promise.all(
    dbs.map(async (db)=> await fetchDatabase(db))
  ).then(() => {
    return topLevelDirs
  })


const fetchDatabase = async(db) => {
  const dirPages = topLevelDirs[db.child_database.title.slugify()] = {
    pages: [],
  }

  // fetch all children of those databases
  const pages = await notion.databases.query({
    database_id: db.id,
  });

  await Promise.all(
    pages.results.map(async (page)=> await fetchPageContent(page, db.child_database.title))
  ).then(res => {
    return res
  })
}

const fetchPageContent = async (page, directory) => {
  // get page content 
  // const pageContent = await notion.blocks.children.list({
  //   block_id: page.id,
  //   page_size: 50,
  // })

//   const authorIds = page.properties?.Author?.people
//   let authors;
//  if (authorIds?.length) {
//   authors = await Promise.all(
//     authorIds.map(async (author) => await notion.users.retrieve({ user_id: author.id }))
//   ).then(res=>{
//     if (res?.length) {
//       return res.map(author => author.name)
//     }
//   })
//  }

  // const codeblockPairs = []
    await Promise.all(
      pageContent.results.map( async block=>{
        if (block.type === 'code') {
          const id = nanoid(6)
          const code = block.code.rich_text[0].plain_text
          let components = Array.from(code.matchAll(/<(\w*)(?:\s|>)/g), (m) => m[1]);
          delete block.code
    
          const renderedContent = await renderNotionForms({id, components, code})
    
          block.type = 'paragraph'
          block.paragraph = {
            rich_text : [
              {
                type: 'text',
                text: {
                  content: renderedContent
                },
                plain_text: renderedContent,
                "annotations": {
                  "bold": false,
                  "italic": false,
                  "strikethrough": false,
                  "underline": false,
                  "code": false,
                  "color": "default"
                },
              }
            ]
          }
        }
      })
    )
  
 

 let coverImage = await notion.pages.retrieve({ page_id: page.id });

 coverImage = coverImage && coverImage?.cover?.external?.url || coverImage?.cover?.file.url 

  const parsed = markdownParser.parse(pageContent.results)

  if (page.properties.Name.title[0]?.plain_text) {
  topLevelDirs[directory.slugify()].pages.push({
    title: page.properties.Name.title[0]?.plain_text,
    authors,
    coverImage,
    route: `${directory === 'Main' ? '' : '/' + directory.slugify()}/${page.properties.Name.title[0]?.plain_text?.slugify()}`.toLowerCase(),
    content: parsed
  })
}
fs.writeFileSync('./debug/notion.json', JSON.stringify(topLevelDirs))
}

export default fetchNotionData

