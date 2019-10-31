import React, { useState, useEffect } from 'react'
import Masonry from 'react-masonry-css'
import { CircularProgress } from '@material-ui/core'

import OverlayDrawer from 'components/OverlayDrawer'
import Search from 'components/Grid/Search'

import { Image } from './types'
import { searchImages, listImages } from './helpers'
import Thumbnail from './Thumbnail'
import NoResults from './NoResults'

interface Props {
  isOpen: boolean
  onClose?: () => void
  onSelect: (photo?: Image) => void
}

export default function ImageDrawer({
  isOpen,
  onClose = () => {},
  onSelect
}: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<Image[] | null>(null)

  async function fetchDefaultImages() {
    setIsLoading(true)

    const defaultImagesList = await listImages()

    setImages(defaultImagesList)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchDefaultImages()
  }, [])

  return (
    <OverlayDrawer
      open={isOpen}
      onClose={() => {
        onClose()
      }}
    >
      <OverlayDrawer.Header title="Select An Image" />
      <OverlayDrawer.Body>
        <Search
          onChange={async (value: string) => {
            if (!value) {
              await fetchDefaultImages()

              return
            }

            setIsLoading(true)

            const result = await searchImages(value)

            setImages(result)
            setIsLoading(false)
          }}
          onClearSearch={async () => fetchDefaultImages()}
          placeholder="Search for an image"
          isSearching={isLoading}
          debounceTime={500}
          style={{
            margin: '1.5rem 0'
          }}
        />
        {isLoading && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <CircularProgress />
          </div>
        )}
        {!isLoading && images && images.length > 0 && (
          <Masonry
            style={{ display: 'flex' }}
            breakpointCols={{
              default: 3
            }}
          >
            {images.map(item => (
              <Thumbnail
                key={item.id}
                image={item}
                onClick={image => onSelect(image)}
              />
            ))}
          </Masonry>
        )}
        {!isLoading && images && images.length === 0 && <NoResults />}
      </OverlayDrawer.Body>
    </OverlayDrawer>
  )
}
