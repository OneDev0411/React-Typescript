import React, { useEffect } from 'react'
import { Box } from '@material-ui/core'

import LoadingContainer from 'components/LoadingContainer'
import Masonry from 'components/Masonry'

import NoResults from '../../NoResults'
import Image from '../../Image'
import { ImagesTabProps } from '../../types'
import { useGifLibrary } from './hooks'
import { getGifUrl } from './helpers'

export default function GifLibrary({ query, onSelect }: ImagesTabProps) {
  const { isLoading, results, search } = useGifLibrary()

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
        const gifUrl = getGifUrl(item)

        return (
          <Box p={1} onClick={() => onSelect(gifUrl)} key={item.id}>
            <Image src={gifUrl} alt={item.title} />
          </Box>
        )
      })}
    </Masonry>
  )
}
