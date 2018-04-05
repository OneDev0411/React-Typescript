/*
  This button is extend from ShadowButton.
  It is just a container for svg icons as a button.
  Don't use with any text or another element as sibling.
*/

import PropTypes from 'prop-types'
import ShadowButton from '../ShadowButton'

const propTypes = {
  size: PropTypes.number
}

const IconButton = ShadowButton.extend`
  width: ${props => props.size};
  width: ${props => props.size};
  font-size: 0;

  > svg {
    fill: ${props => props.color};
  }

  ${props =>
    !props.disabled &&
    `&:hover {
      > svg {
        fill: ${props.hoverColor};
      }
    }`};
`

IconButton.propTypes = propTypes

export default IconButton