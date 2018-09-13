import PropTypes from 'prop-types'
import { css } from 'styled-components'

import { blue } from '../../../utils/colors'

import Button from '../ActionButton'
import { getIconSize, getIconStatesStyle } from '../helpers'

const propTypes = {
  /**
   * Composes the Button component as the base.
   */
  ...Button.propTypes,

  /**
   * When true, the button size will be same as icon size.
   */
  isFit: PropTypes.bool,

  /**
   * The size of the button. {small, medium, large, XLarge}
   */
  iconSize: Button.propTypes.size
}

const defaultProps = {
  ...Button.defaultProps,
  appearance: 'icon',
  isFit: false,
  iconSize: Button.defaultProps.size
}

const getColor = props => {
  if (props.appearance === 'primary') {
    return '#fff'
  }

  if (
    props.appearance === 'outline' ||
    (props.appearance === 'icon' && props.inverse)
  ) {
    return '#000'
  }

  return blue.A100
}

const checkFit = props => {
  if (props.isFit) {
    const size = getIconSize(props.iconSize)

    return css`
      padding: 0;
      width: ${size};
      height: ${size};
      line-height: ${size};
    `
  }
}

const IconButton = Button.extend`
  ${props => checkFit(props)};

  ${props =>
    props.appearance === 'icon' && props.inverse ? 'border: none;' : ''};

  > svg {
    width: ${props => getIconSize(props.iconSize)};
    height: ${props => getIconSize(props.iconSize)};
    fill: ${props => getColor(props)};
  }

  ${props => getIconStatesStyle(props)};
`

export default Object.assign(IconButton, {
  propTypes,
  defaultProps
})
