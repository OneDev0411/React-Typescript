import React from 'react'

import Icon from './Icon'
import IconButton from '../../../../../../../views/components/Button/IconButton'

const SwitchButton = ({ active, clickHandler, icon }) => (
  <IconButton onClick={clickHandler} disabled={active}>
    <Icon name={icon} active={active} />
  </IconButton>
)

export default SwitchButton
