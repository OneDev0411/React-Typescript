import VisibilitySensor from 'react-visibility-sensor'

import DrawerResultCard, { DrawerResultCardProps } from './DrawerResultCard'
import { RSSArticleMetadata } from './types'
import { useGetArticleImage } from './use-get-article-image'

interface SearchArticleItemProps
  extends Pick<DrawerResultCardProps, 'onSelect' | 'isSelected'> {
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
    <VisibilitySensor onChange={handleVisibilityChange}>
      <DrawerResultCard
        {...otherProps}
        imageUrl={image}
        imageAspect={0.58}
        overline={article.publisher}
        overlineIcon={article.publisherIcon}
        overlineDate={article.publishDate ?? article.createdDate}
        title={article.title}
        link={article.url}
        onImageError={handleBrokenImage}
      />
    </VisibilitySensor>
  )
}

export default SearchArticleItem
