import React from 'react'
import PropTypes from 'prop-types'
import { mdiChevronDown } from '@mdi/js'

import { SvgIcon } from '../../SvgIcons/SvgIcon'
import TextIconButton from '../TextIconButton'

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
      iconRight={() => <SvgIcon path={mdiChevronDown} />}
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
