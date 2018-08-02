import Brand from '../../../../controllers/Brand'
import * as types from '../../../../constants/listings/map'
import getListingsByPolygonPonits from '../../search/get-listings/by-polygon-points'

const overlayColor = `#${Brand.color('primary', '3388ff')}`

const getPolygonBounds = polygon => {
  const points = polygon.getPath().b.map(bound => ({
    latitude: bound.lat(),
    longitude: bound.lng()
  }))

  return [...points, points[0]]
}

let drawingManager

const setDrawingManager = (dispatch, getState) => {
  drawingManager = new google.maps.drawing.DrawingManager({
    drawingControl: false,
    drawingMode: google.maps.drawing.OverlayType.POLYGON,
    polygonOptions: {
      zIndex: 1,
      strokeWeight: 5,
      fillOpacity: 0.35,
      fillColor: overlayColor,
      strokeColor: overlayColor
    }
  })
  drawingManager.setMap(window.currentMap)

  google.maps.event.addListener(drawingManager, 'polygoncomplete', polygon => {
    const points = getPolygonBounds(polygon)

    dispatch(
      setPolygon({
        points,
        shape: polygon
      })
    )
    drawingManager.setDrawingMode(null)
    getListingsByPolygonPonits(points)(dispatch, getState)
  })
}

export const activeDrawing = isDrawing => (dispatch, getState) => {
  dispatch({
    tabName: 'search',
    type: types.ACTIVE_DRAWING
  })

  setDrawingManager(dispatch, getState)
}

export const inactiveDrawing = () => dispatch => {
  if (drawingManager) {
    drawingManager.setMap(null)
  }

  dispatch({
    tabName: 'search',
    type: types.INACTIVE_DRAWING
  })
}

export const removePolygon = polygon => (dispatch, getState) => {
  polygon.setMap(null)

  dispatch({
    tabName: 'search',
    type: types.REMOVE_POLYGON
  })

  // if (drawingManager && drawingManager.map.id === window.currentMap.id) {
  //   drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON)
  // } else {
  //   google.maps.event.clearInstanceListeners(drawingManager)
  //   setDrawingManager(dispatch, getState)
  // }
}

export const setPolygon = polygon => ({
  polygon,
  tabName: 'search',
  type: types.SET_POLYGON
})
