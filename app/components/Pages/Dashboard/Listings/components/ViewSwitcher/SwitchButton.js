import React from 'react'

import Icon from './Icon'
import IconButton from '../../../../../../views/components/Button/IconButton'

const SwitchButton = ({ isActive, onClick, icon }) => (
  <IconButton
    isFit
    data-view={icon}
    onClick={onClick}
    disabled={isActive}
    style={{ marginLeft: '1em' }}
  >
    <Icon name={icon} isActive={isActive} />
  </IconButton>
)

export default SwitchButton
