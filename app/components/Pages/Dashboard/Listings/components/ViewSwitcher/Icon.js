import React from 'react'

import IconGrid from '../../../Partials/Svgs/List'
import IconMap from '../../../../../../views/components/SvgIcons/Properties/IconProperties'
import IconGallery from '../../../../../../views/components/SvgIcons/GalleryView/IconGalleryView'
import { primary, grey } from '../../../../../../views/utils/colors'

const Icon = props => {
  let color = grey.A900

  if (props.isActive) {
    color = primary
  }

  const map = <IconMap style={{ fill: color }} />
  const grid = <IconGrid color={color} />
  const gallery = <IconGallery style={{ fill: color }} />

  switch (props.name) {
    case 'map':
      return map
    case 'grid':
      return grid
    case 'gallery':
      return gallery
    default:
      return map
  }
}

export default Icon
