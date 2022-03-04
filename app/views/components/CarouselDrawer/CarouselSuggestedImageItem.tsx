import { mdiPlus } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { muiIconSizes } from '../SvgIcons/icon-sizes'

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
      label={<SvgIcon path={mdiPlus} size={muiIconSizes.large} />}
      onClick={handleClick}
    />
  )
}

export default CarouselSuggestedImageItem
