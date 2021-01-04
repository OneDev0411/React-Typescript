import React from 'react'

import LoadingContainer from 'components/LoadingContainer'
import Masonry from 'components/Masonry'

import NoResults from '../../NoResults'
import ImageThumbnail from '../../ImageThumbnail'
import { SearchableImageTabProps } from '../../types'
import { useGifLibrary } from './hooks'
import { getGifUrl } from './helpers'

export default function GifLibrary({
  query,
  onSelect
}: SearchableImageTabProps) {
  const { isLoading, results } = useGifLibrary(query)

  if (isLoading) {
    return <LoadingContainer style={{ padding: '20%' }} noPaddings />
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
