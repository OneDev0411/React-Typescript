/*
  This button is extend from ShadowButton.
  It is just a container for svg icons as a button.
  Don't use with any text or another element as sibling.
*/

import Button from '../ActionButton'
import { isOutline, getIconSize, getIconStatesStyle } from '../helpers'

const defaultProps = {
  ...Button.defaultProps,
  appearance: 'icon'
}

const getColor = props => {
  if (isOutline(props)) {
    return '#000'
  }

  if (props.appearance === 'primary') {
    return '#fff'
  }

  return '#003bdf'
}

const getPadding = size => {
  if (size === 'medium') {
    return 'padding: 0 8px'
  }
}

const IconButton = Button.extend`
  ${props => getPadding(props.size)};

  > svg {
    width: ${props => getIconSize(props.size)};
    height: ${props => getIconSize(props.size)};
    fill: ${props => getColor(props)};
  }

  ${props => getIconStatesStyle(props)};
`

export default Object.assign(IconButton, {
  defaultProps
})
