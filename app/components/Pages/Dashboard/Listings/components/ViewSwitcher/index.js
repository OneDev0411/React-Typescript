import React from 'react'
import Flex from 'styled-flex-component'

import SwitchButton from './SwitchButton'

export const ViewSwitcher = props => {
  const { activeView, onChange } = props

  return (
    <Flex>
      <SwitchButton
        icon="grid"
        isActive={activeView === 'grid'}
        onClick={onChange}
      />
      <SwitchButton
        icon="map"
        isActive={activeView === 'map'}
        onClick={onChange}
      />
      <SwitchButton
        icon="gallery"
        isActive={activeView === 'gallery'}
        onClick={onChange}
      />
    </Flex>
  )
}
