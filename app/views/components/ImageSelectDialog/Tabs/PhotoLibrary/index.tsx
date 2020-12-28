import React, { useEffect } from 'react'
import { Box } from '@material-ui/core'

import LoadingContainer from 'components/LoadingContainer'
import Masonry from 'components/Masonry'

import NoResults from '../../NoResults'
import Image from '../../Image'
import { ImagesTabProps } from '../../types'
import { usePhotoLibrary } from './hooks'

export default function PhotoLibrary({ query, onSelect }: ImagesTabProps) {
  const { isLoading, results, search } = usePhotoLibrary()

  useEffect(() => {
    search(query)
  }, [search, query])

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
          <Box p={1} onClick={() => onSelect(item.url)} key={item.id}>
            <Image src={item.thumbnail ?? item.url} alt={item.id} />
          </Box>
        )
      })}
    </Masonry>
  )
}
