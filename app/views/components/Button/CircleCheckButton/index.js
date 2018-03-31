import React from 'react'
import { bool, func } from 'prop-types'

import IconButton from '../IconButton'
import Icon from '../../SvgIcons/CheckCircle/IconCheckCircle'

const propTypes = {
  checked: bool.isRequired,
  onClick: func.isRequired
}

function CircleCheckButton({ onClick, checked, ...props }) {
  return (
    <IconButton
      {...props}
      role="checkbox"
      onClick={onClick}
      aria-checked={checked}
    >
      <Icon checked={checked} />
    </IconButton>
  )
}

CircleCheckButton.propTypes = propTypes

export default CircleCheckButton
