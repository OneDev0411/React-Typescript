import React from 'react'
import { Button } from 'react-bootstrap'

const DrawingRemoveButton = ({ onClick }) =>
  <Button
    bsStyle="danger"
    onClick={onClick}
    className="c-mls-toolbar__drawing-remove-btn transition">
    <span>&times;</span>
  </Button>

export default DrawingRemoveButton
