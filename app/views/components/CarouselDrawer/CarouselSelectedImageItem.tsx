import React from 'react'
import { Close } from '@material-ui/icons'

import CarouselImageItem, { CarouselImageItemProps } from './CarouselImageItem'

export interface CarouselSelectedImageItemProps
  extends Omit<CarouselImageItemProps, 'label'> {
  onRemove: (src: string) => void
}

function CarouselSelectedImageItem({
  src,
  onRemove,
  ...otherProps
}: CarouselSelectedImageItemProps) {
  const handleRemove = () => {
    onRemove(src)
  }

  return (
    <CarouselImageItem
      {...otherProps}
      src={src}
      droppable
      onClick={handleRemove}
      label={<Close />}
    />
  )
}

export default CarouselSelectedImageItem
