import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'

import DrawIcon from '../../../../Partials/Svgs/Draw'
import Brand from '../../../../../../../controllers/Brand'
import {
  activeDrawing,
  inactiveDrawing
} from '../../../../../../../store_actions/listings/map/drawing'

const DrawingButton = ({
  isLoggedIn,
  onClick,
  isDrawing,
  isFetching,
  hasPolygon = []
}) =>
  isLoggedIn &&
  <button
    onClick={onClick}
    className="c-mls-toolbar__drawing-btn"
    disabled={hasPolygon.length || isFetching}>
    <DrawIcon
      color={isDrawing ? `#${Brand.color('primary', '3388ff')}` : '#929292'}
    />
  </button>

export default compose(
  connect(
    ({ data, search }) => ({
      isLoggedIn: data.user || false,
      isDrawing: search.map.drawing.isDrawing,
      hasPolygon: search.map.drawing.points,
      isFetching: search.listings.isFetching
    }),
    { inactiveDrawing, activeDrawing }
  ),
  withHandlers({
    onClick: ({ inactiveDrawing, activeDrawing, isDrawing }) => () => {
      if (isDrawing) {
        inactiveDrawing()
      } else {
        activeDrawing()
      }
    }
  })
)(DrawingButton)
