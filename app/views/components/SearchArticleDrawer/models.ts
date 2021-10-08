import superagent, { SuperAgentRequest } from 'superagent'

import { ArticleMetadata, RSSFeed, RSSSource } from './types'

export async function getRSSFeeds(rssSources: RSSSource[]): Promise<RSSFeed[]> {
  const response = await superagent
    .post('/api/utils/rss-feeds')
    .send({ sources: rssSources.map(rssSource => rssSource.url) })

  return response.body
}

export function getUrlMetadataRequest(url: string): SuperAgentRequest {
  return superagent.post('/api/utils/get-url-metadata').send({ url })
}

export async function getUrlMetadata(
  url: string
): Promise<Nullable<ArticleMetadata>> {
  const response = await getUrlMetadataRequest(url)

  return response.body.response ?? null
}
