import React from 'react'
import { Box, Grid } from '@material-ui/core'

import { H3 } from 'components/Typography/headings'

import CarouselSelectedImageItem from './CarouselSelectedImageItem'

interface CarouselSelectedImageListProps {
  images: string[]
  onRemove: (src: string) => void
}

function CarouselSelectedImageList({
  images,
  onRemove
}: CarouselSelectedImageListProps) {
  return (
    <Box>
      <H3>Selected Items:</H3>
      <Grid container>
        {images.map(image => (
          <CarouselSelectedImageItem
            key={image}
            src={image}
            onRemove={onRemove}
          />
        ))}
      </Grid>
    </Box>
  )
}

export default CarouselSelectedImageList
