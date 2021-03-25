import React from 'react'
import { Add } from '@material-ui/icons'

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
      label={<Add />}
      onClick={handleClick}
    />
  )
}

export default CarouselSuggestedImageItem
