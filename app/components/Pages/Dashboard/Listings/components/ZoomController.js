import React from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'

const ZoomButton = ({
  type,
  onClick
}) => {
  const icon = type === 'IN' ? 'plus' : 'minus'
  return (
    <Button
      bsSize="large"
      className="c-map__zoom-controller__button"
      onClick={(e) => {
        onClick(type)
        e.currentTarget.blur()
      }}
    >
      <i className={`fa fa-${icon}`} />
    </Button>
  )
}

const ZoomController = ({
  onClickZoomHandler
}) => (
  <ButtonGroup
    vertical
    className="c-map__zoom-controller"
  >
    <ZoomButton onClick={onClickZoomHandler} type="IN" />
    <ZoomButton onClick={onClickZoomHandler} type="OUT" />
  </ButtonGroup>
)

export default ZoomController