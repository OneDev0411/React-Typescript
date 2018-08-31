import React from 'react'
import SvgList from '../../../../Partials/Svgs/List'
import SvgGlobe from '../../../../Partials/Svgs/Globe'
import SvgPhotos from '../../../../Partials/Svgs/Photos'

import { primary } from '../../../../../../../views/utils/colors'

const Icon = ({ name, active }) => {
  let color = '#000'

  if (active) {
    color = primary
  }

  const list = <SvgList color={color} />
  const globe = <SvgGlobe color={color} />
  const grid = <SvgPhotos color={color} />

  switch (name) {
    case 'GLOBE':
      return globe
    case 'LIST':
      return list
    case 'GRID':
      return grid
    default:
      return globe
  }
}

export default Icon
