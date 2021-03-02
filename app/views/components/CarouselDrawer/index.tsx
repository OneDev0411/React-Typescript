import React, { useState, useEffect, useMemo } from 'react'

import { Button, Box } from '@material-ui/core'

import type { Model } from 'backbone'

import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import { createChildContext } from 'react-dnd/lib/cjs/DragDropContext'

import OverlayDrawer from 'components/OverlayDrawer'

import CarouselSelectedImageList from './CarouselSelectedImageList'
import CarouselSuggestedImageList from './CarouselSuggestedImageList'
import { CarouselImageItemEdge } from './types'

export interface CarouselDrawerProps {
  isOpen: boolean
  carousel: Model | null
  onClose?: () => void
  onSelect: (images: string[]) => void
  suggestedImages?: string[]
}

const { dragDropManager } = createChildContext(HTML5Backend)

function CarouselDrawer({
  isOpen,
  carousel,
  onClose,
  onSelect,
  suggestedImages
}: CarouselDrawerProps) {
  const [selectedImages, setSelectedImages] = useState<string[]>([])

  useEffect(() => {
    const defaultImages = suggestedImages?.slice(0, 5) ?? [
      'https://picsum.photos/seed/image1/1600/1200',
      'https://picsum.photos/seed/image2/1600/1200',
      'https://picsum.photos/seed/image3/1600/1200',
      'https://picsum.photos/seed/image4/1600/1200',
      'https://picsum.photos/seed/image5/1600/1200'
    ]
    const images = carousel?.get('images') ?? defaultImages

    if (images) {
      setSelectedImages(images)
    }
  }, [carousel, suggestedImages])

  const remainingImages = useMemo(
    () =>
      suggestedImages?.filter(image => !selectedImages.includes(image)) ?? [],
    [suggestedImages, selectedImages]
  )

  const handleAdd = (src: string) => {
    setSelectedImages(images => [...images, src])
  }

  const handleRemove = (src: string) => {
    setSelectedImages(images => images.filter(image => image !== src))
  }

  const handleConfirm = () => {
    carousel?.set('images', selectedImages)
    onSelect(selectedImages)
  }

  const handleClose = () => {
    onClose?.()
  }

  const handleImageDrop = (
    src: string,
    target: string,
    edge: CarouselImageItemEdge
  ) => {
    setSelectedImages(images => {
      const newImages = [...images]

      // remove the src from the images list
      const srcIndex = newImages.indexOf(src)

      if (srcIndex > -1) {
        newImages.splice(srcIndex, 1)
      }

      // insert the src near the target
      const targetIndex = newImages.indexOf(target)

      if (edge === CarouselImageItemEdge.BEFORE) {
        newImages.splice(targetIndex, 0, src)
      } else {
        newImages.splice(targetIndex + 1, 0, src)
      }

      return newImages
    })
  }

  return (
    <OverlayDrawer open={isOpen} onClose={handleClose}>
      <OverlayDrawer.Header title="Manage Carousel" />
      <OverlayDrawer.Body>
        <Box marginTop={3}>
          <DragDropContextProvider manager={dragDropManager}>
            <CarouselSelectedImageList
              images={selectedImages}
              onRemove={handleRemove}
              onImageDrop={handleImageDrop}
            />
            {!!remainingImages.length && (
              <CarouselSuggestedImageList
                images={remainingImages}
                onAdd={handleAdd}
              />
            )}
          </DragDropContextProvider>
        </Box>
      </OverlayDrawer.Body>
      <OverlayDrawer.Footer rowReverse>
        <Button
          color="primary"
          variant="contained"
          onClick={handleConfirm}
          disabled={!selectedImages.length}
        >
          Confirm
        </Button>
      </OverlayDrawer.Footer>
    </OverlayDrawer>
  )
}

export default CarouselDrawer
