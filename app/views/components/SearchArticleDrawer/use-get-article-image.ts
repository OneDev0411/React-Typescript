import useAsync from '@app/hooks/use-async'

import { getUrlMetadata } from './models'
import { RSSArticleMetadata } from './types'
import { useSearchArticleImageCache } from './use-search-article-image-cache'

const DEFAULT_IMAGE_URL = '/' // TODO: insert the url here

interface UseGetArticleImage {
  image: Optional<string>
  loadImage: () => void
}

export function useGetArticleImage(
  article: RSSArticleMetadata
): UseGetArticleImage {
  const { setItem, getItem } = useSearchArticleImageCache()
  const { run, reset } = useAsync<Nullable<string>>()

  const imageUrl = article.image ?? getItem(article.url)

  const loadImage = () => {
    if (imageUrl) {
      return
    }

    reset()

    run(async () => {
      try {
        const metadata = await getUrlMetadata(article.url)
        const image = metadata?.image ?? DEFAULT_IMAGE_URL

        setItem(article.url, image)

        return image
      } catch (_) {
        setItem(article.url, DEFAULT_IMAGE_URL)

        return DEFAULT_IMAGE_URL
      }
    })
  }

  return { image: imageUrl, loadImage }
}
