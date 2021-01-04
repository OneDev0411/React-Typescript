import React from 'react'

import LoadingContainer from 'components/LoadingContainer'
import Masonry from 'components/Masonry'

import NoResults from '../../NoResults'
import ImageThumbnail from '../../ImageThumbnail'
import { SearchableImageTabProps } from '../../types'
import { usePhotoLibrary } from './hooks'

export default function PhotoLibrary({
  query,
  onSelect,
  onEdit
}: SearchableImageTabProps) {
  const { isLoading, results } = usePhotoLibrary(query)

  const handleEdit = async (imageUrl: string) => {
    if (!onEdit) {
      return
    }

    onEdit(imageUrl)
  }

  if (isLoading) {
    return <LoadingContainer style={{ padding: '20%' }} noPaddings />
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
            onEditClick={onEdit ? () => handleEdit(item.url) : undefined}
            onClick={() => onSelect(item.url)}
            src={item.url}
            alt={item.id}
          />
        )
      })}
    </Masonry>
  )
}
