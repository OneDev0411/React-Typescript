import { InView } from 'react-intersection-observer'

import { SearchResultCard, SearchResultCardProps } from '../SearchResultCard'

import { RSSArticleMetadata } from './types'
import { useGetArticleImage } from './use-get-article-image'

interface SearchArticleItemProps
  extends Pick<SearchResultCardProps, 'onSelect' | 'isSelected'> {
  article: RSSArticleMetadata
}

function SearchArticleItem({ article, ...otherProps }: SearchArticleItemProps) {
  const { image, getImage, handleBrokenImage } = useGetArticleImage(article)

  const handleVisibilityChange = (isVisible: boolean) => {
    if (isVisible) {
      getImage()
    }
  }

  return (
    <InView as="div" onChange={handleVisibilityChange}>
      <SearchResultCard
        {...otherProps}
        imageUrl={image}
        imageAspect={0.58} // 9/16 aspect ration
        imageAlt={article.publisher}
        overline={article.publisher}
        overlineIcon={article.publisherIcon}
        overlineDate={article.publishDate ?? article.createdDate}
        title={article.title}
        link={article.url}
        onImageError={handleBrokenImage}
      />
    </InView>
  )
}

export default SearchArticleItem
