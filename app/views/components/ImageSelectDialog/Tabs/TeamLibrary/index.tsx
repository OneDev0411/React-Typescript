import React, { memo } from 'react'
import { useSelector } from 'react-redux'

import { selectUser } from 'selectors/user'
import { getActiveTeamId } from 'utils/user-teams'

import LoadingContainer from 'components/LoadingContainer'
import Masonry from 'components/Masonry'

import NoResults from '../../NoResults'
import ImageThumbnail from '../../ImageThumbnail'
import { SearchableImageTabProps } from '../../types'
import { useTeamLibrary } from './hooks'

function TeamLibrary({ query, onSelect, onEdit }: SearchableImageTabProps) {
  const user = useSelector(selectUser)
  const activeBrandId = getActiveTeamId(user) as UUID
  const { isLoading, results } = useTeamLibrary(activeBrandId, query)

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
        const imageUrl = item.file.url

        return (
          <ImageThumbnail
            key={item.id}
            onEditClick={
              onEdit
                ? () => handleEdit(`/api/utils/cors/${btoa(imageUrl)}`)
                : undefined
            }
            onClick={() => onSelect(imageUrl)}
            src={imageUrl}
            alt={item.label}
          />
        )
      })}
    </Masonry>
  )
}

export default memo(TeamLibrary)
