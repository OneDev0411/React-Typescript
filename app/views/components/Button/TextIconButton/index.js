import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import Button from '../ActionButton'
import { isOutline, getIconSize, getStatesStyle, iconAims } from './helpers'

class TextIconButton extends PureComponent {
  propTypes = {
    /**
     * Composes the Button component as the base.
     */
    ...Button.propTypes,

    /**
     * The button text.
     */
    text: PropTypes.string,

    /**
     * Sets an icon before the text. Can be any icon from Rechat SVG icons.
     */
    iconLeft: PropTypes.func,

    /**
     * The aim of the left icon. Not a big use case for this.
     */
    iconLeftAim: PropTypes.oneOf(Object.keys(iconAims)),

    /**
     * Sets an icon after the text. Can be any icon from Rechat SVG icons.
     */
    iconRight: PropTypes.func,

    /**
     * The aim of the right icon. Useful to aim a triangle down.
     */
    iconRightAim: PropTypes.oneOf(Object.keys(iconAims))
  }

  static defaultProps = {
    appearance: 'default',
    disabled: false,
    inverse: false,
    size: 'medium',
    text: '',
    iconLeftAim: 'none',
    iconRightAim: 'none'
  }

  render() {
    const {
      iconLeft,
      iconRight,
      iconLeftAim,
      iconRightAim,
      text,
      ...rest
    } = this.props

    let IconLeft = () => null
    let IconRight = () => null

    if (iconLeft) {
      IconLeft = iconLeft.extend`
        margin-right: ${text ? '8px' : 0};
        transform: rotate(${iconAims[iconLeftAim]});
      `
    }

    if (iconRight) {
      IconRight = iconRight.extend`
        margin-left: ${text ? '8px' : 0};
        transform: rotate(${iconAims[iconRightAim]});
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

    const $text = text ? React.createElement('span', {}, text) : null

    return (
      <ExtendedButton {...rest}>
        <IconLeft />
        {$text}
        <IconRight />
      </ExtendedButton>
    )
  }
}

export default TextIconButton
