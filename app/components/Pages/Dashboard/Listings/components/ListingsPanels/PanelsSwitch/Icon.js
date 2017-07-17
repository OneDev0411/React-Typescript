import React from 'react'
import SvgList from '../../../../Partials/Svgs/List'
import SvgGlobe from '../../../../Partials/Svgs/Globe'
import SvgPhotos from '../../../../Partials/Svgs/Photos'
import Brand from '../../../../../../../controllers/Brand'

const Icon = ({ name, active }) => {
  let color = '#929292'

  if (active) {
    color = `#${Brand.color('primary', '3388ff')}`
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
