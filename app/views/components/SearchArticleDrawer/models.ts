import superagent from 'superagent'

import { ArticleMetadataResponse, RSSFeed, RSSSource } from './types'

export async function getRSSFeeds(rssSources: RSSSource[]): Promise<RSSFeed[]> {
  const response = await superagent
    .post('/api/utils/rss-feeds')
    .send({ sources: rssSources.map(rssSource => rssSource.url) })

  return response.body
}

export async function getUrlMetadata(
  url: string
): Promise<ArticleMetadataResponse> {
  const response = await superagent
    .post('/api/utils/get-url-metadata')
    .send({ url })

  return response.body
}
