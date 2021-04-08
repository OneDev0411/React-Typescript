import React from 'react'
import { Box, Grid } from '@material-ui/core'

import { H3 } from 'components/Typography/headings'

import CarouselSelectedImageItem, {
  CarouselSelectedImageItemProps
} from './CarouselSelectedImageItem'
import CarouselImageAddButton, {
  CarouselImageAddButtonProps
} from './CarouselImageAddButton'

export interface CarouselSelectedImageListProps
  extends Required<
      Pick<CarouselSelectedImageItemProps, 'onRemove' | 'onImageDrop'>
    >,
    Pick<CarouselImageAddButtonProps, 'onImageAdd' | 'onImageUpload'> {
  images: string[]
}

function CarouselSelectedImageList({
  images,
  onImageAdd,
  onImageUpload,
  ...otherProps
}: CarouselSelectedImageListProps) {
  return (
    <Box>
      <H3>Selected Items:</H3>
      <Grid container>
        {images.map(image => (
          <CarouselSelectedImageItem key={image} src={image} {...otherProps} />
        ))}
        <CarouselImageAddButton
          onImageAdd={onImageAdd}
          onImageUpload={onImageUpload}
        />
      </Grid>
    </Box>
  )
}

export default CarouselSelectedImageList
