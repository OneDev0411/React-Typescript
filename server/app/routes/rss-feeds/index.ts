import { Request, Response } from 'express'
import omit from 'lodash/omit'
import Parser from 'rss-parser'

interface ContentMedia {
  $: {
    url: string
    medium?: string
    type?: string
  }
}

const parser: Parser = new Parser({
  headers: {
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,application/rss+xml'
  },
  timeout: 25000,
  customFields: {
    item: ['createdDate', 'media:content']
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
                ...omit(item, [
                  'media:content',
                  'content:encoded',
                  'content:encodedSnippet',
                  'contentSnippet'
                ]),
                content: removeHTMLTags(item.content ?? ''),
                sourceIndex,
                image:
                  getImageUrlFromContentMedia(item['media:content']) ||
                  extractImageUrlFromContent(item.content ?? '')
              }))
            })
          })
          .catch(() => resolve(null))
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

function extractImageUrlFromContent(content: string): string | undefined {
  return content.match(imageSrcRegex)?.[1]
}

function getImageUrlFromContentMedia(
  contentMedia: ContentMedia | undefined
): string | undefined {
  if (!contentMedia) {
    return
  }

  const type = contentMedia.$?.type || contentMedia.$?.medium

  if (type?.indexOf('image') !== 0) {
    return
  }

  return contentMedia.$?.url
}
