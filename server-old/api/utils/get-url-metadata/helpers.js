import { unfurl } from 'unfurl.js'

export async function getUrlMetadata(url) {
  const result = await unfurl(url)

  const { title, description, open_graph } = result

  if (!title) {
    return undefined
  }

  const metadata = {
    title,
    description,
    url
  }

  if (!open_graph) {
    return metadata
  }

  return {
    ...metadata,
    image: Array.isArray(open_graph)
      ? open_graph[0].images && open_graph[0].images[0].url
      : open_graph.images && open_graph.images[0].url
  }
}
