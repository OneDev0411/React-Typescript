import VisibilitySensor from 'react-visibility-sensor'

import DrawerResultCard, { DrawerResultCardProps } from './DrawerResultCard'
import { RSSArticleMetadata } from './types'
import { useGetArticleImage } from './use-get-article-image'

interface SearchArticleItemProps
  extends Pick<DrawerResultCardProps, 'onSelect' | 'isSelected'> {
  article: RSSArticleMetadata
}

function SearchArticleItem({ article, ...otherProps }: SearchArticleItemProps) {
  const { image, loadImage } = useGetArticleImage(article)

  const handleVisibilityChange = (isVisible: boolean) => {
    if (isVisible) {
      loadImage()
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
        overlineDate={article.publishDate}
        title={article.title}
        link={article.url}
      />
    </VisibilitySensor>
  )
}

export default SearchArticleItem
