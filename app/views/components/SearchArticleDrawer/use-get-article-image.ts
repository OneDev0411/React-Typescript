import useAsync from '@app/hooks/use-async'

import { getUrlMetadata } from './models'
import { RSSArticleMetadata } from './types'
import { useSearchArticleImageCacheActions } from './use-search-article-image-cache-actions'

const DEFAULT_IMAGE_URL = '' // TODO: insert the url here

interface UseGetArticleImage {
  image: string
  loadImage: () => void
}

export function useGetArticleImage(
  article: RSSArticleMetadata
): UseGetArticleImage {
  const { setItem, getItem } = useSearchArticleImageCacheActions()
  const { run, reset } = useAsync<Nullable<string>>()

  const imageUrl = article.image ?? getItem(article.url)

  const loadImage = () => {
    if (imageUrl) {
      return
    }

    reset()

    run(async () => {
      const metadata = await getUrlMetadata(article.url)
      const image = metadata?.image ?? DEFAULT_IMAGE_URL

      setItem(article.url, image)

      return image
    })
  }

  return { image: imageUrl ?? DEFAULT_IMAGE_URL, loadImage }
}
