import React from 'react'
import DrawIcon from '../../../../Partials/Svgs/Draw'

const DrawingButton = ({
  onClickHandler = () => {}
}) => (
  <button
    onClick={onClickHandler}
    className="c-mls-toolbar__drawing-btn"
  >
    <DrawIcon color="#929292" />
  </button>
)

export default DrawingButton