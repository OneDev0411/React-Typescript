import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'styled-components'

import Button from '../ActionButton'
import { isOutline, getIconSize, getStatesStyle } from './helpers'

const propTypes = {
  /**
   * Composes the Button component as the base.
   */
  ...Button.propTypes,

  /**
   * The button text.
   */
  text: PropTypes.string
}

const defaultProps = {
  appearance: 'default',
  disabled: false,
  inverse: false,
  size: 'medium',
  text: ''
}

const TextIconButton = props => {
  let IconBeforeText = () => null
  let IconAfterText = () => null

  if (props.iconBeforeText) {
    IconBeforeText = props.iconBeforeText.extend`
      margin-right: ${props.text ? '8px' : 0};
    `
  }

  if (props.iconAfterText) {
    IconAfterText = props.iconAfterText.extend`
      margin-left: ${props.text ? '8px' : 0};
    `
  }

  const ExtendedButton = Button.extend`
    > svg {
      width: ${props => getIconSize(props.size)};
      height: ${props => getIconSize(props.size)};
      fill: ${props => (isOutline(props) ? '#000' : '#fff')};
    }

    ${props => getStatesStyle(props)};
  `

  let text = props.text ? React.createElement('span', {}, props.text) : null

  return (
    <ExtendedButton {...props}>
      <IconBeforeText />
      {text}
      <IconAfterText />
    </ExtendedButton>
  )
}

export default Object.assign(TextIconButton, {
  propTypes,
  defaultProps
})
