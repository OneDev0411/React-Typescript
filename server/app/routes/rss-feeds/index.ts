import { Request, Response } from 'express'
import Parser from 'rss-parser'

const parser: Parser = new Parser({
  headers: {
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,application/rss+xml'
  },
  timeout: 25000,
  customFields: {
    item: ['createdDate']
  }
})

export default async (req: Request, res: Response) => {
  const rssSources: string[] = Array.isArray(req.body.sources)
    ? req.body.sources
    : []

  const rssPromises = rssSources.map(
    (rssSource, sourceIndex) =>
      new Promise<Parser.Output<{ sourceIndex: number }> | null>(resolve =>
        parser
          .parseURL(rssSource)
          .then(result => {
            resolve({
              ...result,
              items: result.items.map(item => ({
                ...item,
                content: removeHTMLTags(item.content ?? ''),
                sourceIndex,
                image: extractImageUrlFromContent(item.content ?? '')
              }))
            })
          })
          .catch(error => {
            resolve(null)
          })
      )
  )

  const rssResults = await Promise.all(rssPromises)

  const rssLoadedFeeds = rssResults.filter(rssResult => !!rssResult)

  res.json(rssLoadedFeeds)
}

function removeHTMLTags(input: string): string {
  return input.replace(/(<([^>]+)>)/gi, '')
}

const imageSrcRegex = /<img[^>]+src="([^"]+)"/

function extractImageUrlFromContent(content: string) {
  return content.match(imageSrcRegex)?.[1]
}
