import { memo } from 'react'

import Masonry from 'components/Masonry'

import Loading from '../../Loading'
import NoResults from '../../NoResults'
import ImageThumbnail from '../../ImageThumbnail'
import { SearchableImageTabProps } from '../../types'
import { useGifLibrary } from './hooks'
import { getGifUrl } from './helpers'

const DEFAULT_SEARCH_QUERY = 'applause'

function GifLibrary({ query, onSelect }: SearchableImageTabProps) {
  const { isLoading, results } = useGifLibrary(query, DEFAULT_SEARCH_QUERY)

  if (isLoading) {
    return <Loading />
  }

  if (results.length === 0) {
    return <NoResults />
  }

  return (
    <Masonry>
      {results.map(item => {
        const gifUrl = getGifUrl(item)

        return (
          <ImageThumbnail
            key={item.id}
            onClick={() => onSelect(gifUrl)}
            src={gifUrl}
            alt={item.title}
          />
        )
      })}
    </Masonry>
  )
}

export default memo(GifLibrary)
