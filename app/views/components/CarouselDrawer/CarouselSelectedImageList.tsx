import React from 'react'
import { Box, Grid } from '@material-ui/core'

import { H3 } from 'components/Typography/headings'

import CarouselSelectedImageItem, {
  CarouselSelectedImageItemProps
} from './CarouselSelectedImageItem'

interface CarouselSelectedImageListProps
  extends Required<
    Pick<CarouselSelectedImageItemProps, 'onRemove' | 'onImageDrop'>
  > {
  images: string[]
}

function CarouselSelectedImageList({
  images,
  ...otherProps
}: CarouselSelectedImageListProps) {
  return (
    <Box>
      <H3>Selected Items:</H3>
      <Grid container>
        {images.map(image => (
          <CarouselSelectedImageItem key={image} src={image} {...otherProps} />
        ))}
      </Grid>
    </Box>
  )
}

export default CarouselSelectedImageList
