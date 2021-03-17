import { Request, Response, NextFunction } from 'express'
import { unfurl } from 'unfurl.js'

interface UrlResult {
  title: string
  description: string
  open_graph: any
}

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({
      response: await parseUrlMetadata(req.body.url)
    })
  } catch (e) {
    res.status(400)
    res.send('')
  }
}

/**
 * returns parsed metadata of the given url
 * @param url - string url
 */
async function parseUrlMetadata(url: string) {
  const result: UrlResult = await unfurl(url)

  const { title, description, open_graph } = result

  if (!title) {
    return
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
