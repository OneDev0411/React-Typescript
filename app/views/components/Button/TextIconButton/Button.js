import React from 'react'
import styled from 'styled-components'

import ActionButton from '../ActionButton'
import { getIconSize, getIconStatesStyle } from '../helpers'

const ExtendedButton = styled(ActionButton)`
  justify-content: ${props => (props.isBlock ? 'space-between' : 'initial')};

  svg {
    width: ${props => getIconSize(props.iconSize || props.size)};
    height: ${props => getIconSize(props.iconSize || props.size)};
  }

  ${props => getIconStatesStyle(props)};
`

function Button(props) {
  return <ExtendedButton {...props}>{props.children}</ExtendedButton>
}

export default Button
