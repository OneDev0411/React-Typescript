import React from 'react'

import SvgList from '../../../Partials/Svgs/List'
import IconMap from '../../../../../../views/components/SvgIcons/Properties/IconProperties'
import IconGallery from '../../../../../../views/components/SvgIcons/GalleryView/IconGalleryView'
import { primary, grey } from '../../../../../../views/utils/colors'

const Icon = ({ name, active }) => {
  let color = grey.A900

  if (active) {
    color = primary
  }

  const map = <IconMap style={{ fill: color }} />
  const list = <SvgList color={color} />
  const gallery = <IconGallery style={{ fill: color }} />

  switch (name) {
    case 'MAP':
      return map
    case 'LIST':
      return list
    case 'GALLERY':
      return gallery
    default:
      return map
  }
}

export default Icon
