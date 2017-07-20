import React from 'react'
import branch from 'recompose/branch'
import { Button } from 'react-bootstrap'
import renderNothing from 'recompose/renderNothing'

const hideIfNoPoints = hasNoPoint => branch(hasNoPoint, renderNothing)

const enhance = hideIfNoPoints(props => !props.points.length)

export default enhance(({ onClick, points }) =>
  <Button
    bsStyle="danger"
    onClick={onClick}
    className="c-mls-toolbar__drawing-remove-btn transition">
    <span>&times;</span>
  </Button>
)
