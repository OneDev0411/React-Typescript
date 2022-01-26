import { mdiClose } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { muiIconSizes } from '../SvgIcons/icon-sizes'

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
      label={<SvgIcon path={mdiClose} size={muiIconSizes.large} />}
    />
  )
}

export default CarouselSelectedImageItem
