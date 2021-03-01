import React, { useState, useEffect, useMemo } from 'react'

import { Button, Box } from '@material-ui/core'

import type { Model } from 'backbone'

import OverlayDrawer from 'components/OverlayDrawer'

import CarouselSelectedImageList from './CarouselSelectedImageList'
import CarouselSuggestedImageList from './CarouselSuggestedImageList'

export interface CarouselDrawerProps {
  isOpen: boolean
  carousel: Model | null
  onClose?: () => void
  onSelect: (images: string[]) => void
  suggestedImages?: string[]
}

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
    console.log('add', src)
    setSelectedImages(images => [...images, src])
  }

  const handleRemove = (src: string) => {
    console.log('remove', src)
    setSelectedImages(images => images.filter(image => image !== src))
  }

  const handleConfirm = () => {
    carousel?.set('images', selectedImages)
    onSelect(selectedImages)
  }

  const handleClose = () => {
    onClose?.()
  }

  return (
    <OverlayDrawer open={isOpen} onClose={handleClose}>
      <OverlayDrawer.Header title="Manage Carousel" />
      <OverlayDrawer.Body>
        <Box marginTop={3}>
          <CarouselSelectedImageList
            images={selectedImages}
            onRemove={handleRemove}
          />
          {!!remainingImages.length && (
            <CarouselSuggestedImageList
              images={remainingImages}
              onAdd={handleAdd}
            />
          )}
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
