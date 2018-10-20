import React from 'react'
import PropTypes from 'prop-types'

import TextIconButton from '../../Button/TextIconButton'
import IconDrop from '../../SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'

const propTypes = {
  /**
   * Composes the TextIconButton component as the base.
   */
  ...TextIconButton.propTypes,

  /**
   * A flag for checking active state
   */
  isOpen: PropTypes.bool.isRequired
}

const defaultProps = {
  ...TextIconButton.defaultProps,
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
