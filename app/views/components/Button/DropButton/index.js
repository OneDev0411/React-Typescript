import React from 'react'
import PropTypes from 'prop-types'

import BaseButton from '../ActionButton'
import TextIconButton from '../../Button/TextIconButton'
import IconDrop from '../../SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'

const propTypes = {
  /**
   * Composes the TextIconButton component as the base.
   */
  ...BaseButton.propTypes,

  /**
   * A flag for checking active state
   */
  isOpen: PropTypes.bool.isRequired,

  /**
   * Button text
   */
  text: PropTypes.string.isRequired
}

const defaultProps = {
  ...BaseButton.defaultProps,
  appearance: 'outline'
}

function DropButton(props) {
  return (
    <TextIconButton
      {...props}
      iconRight={IconDrop}
      isActive={props.isOpen}
      iconRightAim={props.isOpen ? 'down' : 'up'}
    />
  )
}

export default Object.assign(DropButton, {
  propTypes,
  defaultProps,
  displayName: 'DropButton'
})
