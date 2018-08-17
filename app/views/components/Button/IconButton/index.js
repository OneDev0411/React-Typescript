/*
  This button is extend from ShadowButton.
  It is just a container for svg icons as a button.
  Don't use with any text or another element as sibling.
*/

import { blue } from '../../../utils/colors'
import Button from '../ActionButton'
import { getIconSize, getIconStatesStyle } from '../helpers'

const propTypes = {
  ...Button.propTypes,
  iconSize: Button.propTypes.size
}

const defaultProps = {
  ...Button.defaultProps,
  appearance: 'icon',
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

const IconButton = Button.extend`
  padding: 0;

  ${props =>
    props.appearance === 'icon' && props.inverse ? 'border: none;' : ''};

  > svg {
    width: ${props => getIconSize(props.iconSize || props.size)};
    height: ${props => getIconSize(props.iconSize || props.size)};
    fill: ${props => getColor(props)};
  }

  ${props => getIconStatesStyle(props)};
`

export default Object.assign(IconButton, {
  propTypes,
  defaultProps
})
