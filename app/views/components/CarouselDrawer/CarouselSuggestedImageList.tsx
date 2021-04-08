import React from 'react'
import { Box, Grid } from '@material-ui/core'

import { H3 } from 'components/Typography/headings'

import CarouselSuggestedImageItem from './CarouselSuggestedImageItem'

interface CarouselSuggestedImageListProps {
  images: string[]
  onAdd: (src: string) => void
}

function CarouselSuggestedImageList({
  images,
  onAdd
}: CarouselSuggestedImageListProps) {
  return (
    <Box mt={3}>
      <H3>Suggestions:</H3>
      <Grid container>
        {images.map(image => (
          <CarouselSuggestedImageItem key={image} src={image} onClick={onAdd} />
        ))}
      </Grid>
    </Box>
  )
}

export default CarouselSuggestedImageList
