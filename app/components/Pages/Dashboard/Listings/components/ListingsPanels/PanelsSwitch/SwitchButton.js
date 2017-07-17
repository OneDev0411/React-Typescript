import React from 'react'
import { Button } from 'react-bootstrap'

import Icon from './Icon'

const SwitchButton = ({ active, clickHandler, icon }) =>
  <Button
    className="c-panels-switch__btn"
    onClick={clickHandler}
    disabled={active}>
    <Icon name={icon} active={active} />
  </Button>

export default SwitchButton
