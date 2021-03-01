import React from 'react'
import { AddCircleOutline } from '@material-ui/icons'

import CarouselImageItem, { CarouselImageItemProps } from './CarouselImageItem'

interface CarouselSuggestedImageItemProps
  extends Omit<CarouselImageItemProps, 'label' | 'onClick'> {
  onClick: (src: string) => void
}

function CarouselSuggestedImageItem({
  onClick,
  src,
  ...otherProps
}: CarouselSuggestedImageItemProps) {
  const handleClick = () => {
    onClick(src)
  }

  return (
    <CarouselImageItem
      {...otherProps}
      src={src}
      label={<AddCircleOutline />}
      onClick={handleClick}
    />
  )
}

export default CarouselSuggestedImageItem
