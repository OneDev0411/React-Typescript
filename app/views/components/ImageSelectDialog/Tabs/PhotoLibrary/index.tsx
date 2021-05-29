import { memo } from 'react'

import Masonry from 'components/Masonry'

import Loading from '../../Loading'
import NoResults from '../../NoResults'
import ImageThumbnail from '../../ImageThumbnail'
import { SearchableImageTabProps } from '../../types'
import { usePhotoLibrary } from './hooks'

const DEFAULT_SEARCH_QUERY = 'skyline'

function PhotoLibrary({ query, onSelect, onEdit }: SearchableImageTabProps) {
  const { isLoading, results } = usePhotoLibrary(query, DEFAULT_SEARCH_QUERY)

  if (isLoading) {
    return <Loading />
  }

  if (results.length === 0) {
    return <NoResults />
  }

  return (
    <Masonry>
      {results.map(item => {
        return (
          <ImageThumbnail
            key={item.id}
            onEditClick={onEdit ? () => onEdit(item.url) : undefined}
            onClick={() => onSelect(item.url)}
            src={item.url}
            alt={item.id}
          />
        )
      })}
    </Masonry>
  )
}

export default memo(PhotoLibrary)
