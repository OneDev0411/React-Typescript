import React from 'react'
import branch from 'recompose/branch'
import renderNothing from 'recompose/renderNothing'

import IconButton from '../../../../../views/components/Button/IconButton'
import IconClose from '../../../../../views/components/SvgIcons/Close/CloseIcon'

const Button = IconButton.extend`
  position: absolute;
  top: 140px;
  left: 33%;
  padding: 0.5em;
  border-radius: 50%;
  background: red;

  &:focus {
    outline: 'none';
  }
`

const hideIfNoPoints = hasNoPoint => branch(hasNoPoint, renderNothing)

const enhance = hideIfNoPoints(props => !props.points.length)

export default enhance(props => (
  <Button onClick={props.onClick} iconSize="large">
    <IconClose style={{ fill: '#fff' }} />
  </Button>
))
