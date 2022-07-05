import { Request, Response, NextFunction } from 'express'
import fetch from 'node-fetch'
import { unfurl } from 'unfurl.js'

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({
      type: 'success',
      response: await parseUrlMetadata(req.body.url)
    })
  } catch (e) {
    res.status(400)
    res.json({
      type: 'error',
      errorCode: e.message
    })
  }
}

/**
 * returns parsed metadata of the given url
 * @param url - string url
 */
async function parseUrlMetadata(url: string) {
  await checkIsCloudflareProtected(url)

  const result = await unfurl(url)

  const { title, description, open_graph } = result

  if (!title) {
    throw new Error('MetadataNotFound')
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

const CloudflareServerNames: string[] = ['cloudflare', 'cloudflare-nginx']

async function checkIsCloudflareProtected(url: string): Promise<void> {
  const result = await fetch(url)

  const serverName = result.headers.get('server')?.toLowerCase()

  if (!serverName) {
    return
  }

  if (CloudflareServerNames.some(server => server === serverName)) {
    throw new Error('CloudflareProtected')
  }
}
