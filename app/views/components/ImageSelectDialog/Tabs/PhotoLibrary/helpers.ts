import Unsplash from 'unsplash-js'

import config from 'config'

import { Image, Pagination, MinimalApiImageItem } from './types'

const UNSPLASH_CLIENT = new Unsplash({
  accessKey: config.unsplash.api_key
})

function getImageFromResult(result: MinimalApiImageItem): Image {
  return {
    id: result.id,
    url: result.urls.regular,
    thumbnail: result.urls.thumb
  }
}

export async function searchImages(
  query: string,
  pagination: Pagination = { page: 0, perPage: 30 }
): Promise<Image[]> {
  const { page = 0, perPage = 30 } = pagination

  const result = await UNSPLASH_CLIENT.search.photos(query, page, perPage)

  if (result.status >= 400) {
    return []
  }

  const body = await result.json()

  return body.results.map(getImageFromResult)
}
