export const asSlug = title => title.replace(/\s/g, '-').replace(/[^A-Za-z0-9-]/g, '').toLowerCase()
export const asCopy = obj => JSON.parse(JSON.stringify(obj))

export async function site(domain) {
  const site = domain
  const sitemap = await fetch(`//${site}/system/sitemap.json`).then(res => res.json())
  return {sitemap,info,page,pages}

  function info(title) {
    const slug = asSlug(title)
    return sitemap.find(info => info.slug == slug)
  }

  function page(title) {
    const slug = asSlug(title)
    return fetch(`//${site}/${slug}.json`).then(res => res.json())
  }

  function pages(titles) {
    return Promise.all(
      titles
        .map(title => page(title))
      )
  }
}


export function links(items) {
  const link = /\[\[(.*?)\]\]/g
  const links = []
  let m
  for (const item of items) {
    if(item.type == 'paragraph') {
      const text = item.text
      while(m = link.exec(text)) {
        links.push(m[1])
      }
    }
  }
  return links
}

export function locs(items) {
  const locs = []
  for (const item of items) {
    if(item.type == 'image' && item.location) {
      locs.push([+item.location.latitude, +item.location.longitude])
    }
  }
  return locs
}


export function tags(items,tag) {
  const link = new RegExp(`<${tag}.*?>`,'gi')
  const tags = []
  let m
  for (const item of items) {
    if(item.type == 'html') {
      const text = item.text
      while(m = link.exec(text)) {
        tags.push(m[0])
      }
    }
  }
  return tags
}
