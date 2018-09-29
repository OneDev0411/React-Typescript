import React from 'react'

import Icon from './Icon'
import IconButton from '../../../../../../views/components/Button/IconButton'

const SwitchButton = ({ active, onClick, icon }) => (
  <IconButton
    isFit
    onClick={onClick}
    disabled={active}
    style={{ marginLeft: '1em' }}
  >
    <Icon name={icon} active={active} />
  </IconButton>
)

export default SwitchButton
