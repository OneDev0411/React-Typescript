// controller/alert-map.js
import AppStore from '../../../../stores/AppStore'
import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'
import AppDispatcher from '../../../../dispatcher/AppDispatcher'
const controller = {
  alertHasNotifications(alert_id) {
    let result = false
    const data = AppStore.data
    if (!data.notifications)
      return false
    const summaries = data.notifications.summary.room_notification_summaries
    if (!summaries)
      return false
    summaries.forEach(summary => {
      const user_created_alert_ids = summary.user_created_alert_ids
      if (user_created_alert_ids && user_created_alert_ids.indexOf(alert_id) !== -1)
        result = true
    })
    return result
  },
  acknowledgeNotifications(alert_id) {
    if (!this.alertHasNotifications(alert_id))
      return
    const data = AppStore.data
    const user = data.user
    AppDispatcher.dispatch({
      action: 'acknowledge-alert-notifications',
      user,
      alert_id
    })
  },
  showAlertOnMap(alert) {
    const lat = alert.location.latitude
    const lng = alert.location.longitude
    const options = {
      maximum_price: alert.maximum_price,
      limit: '75',
      maximum_lot_square_meters: alert.maximum_lot_square_meters,
      minimum_bathrooms: alert.minimum_bathrooms,
      maximum_square_meters: alert.maximum_square_meters,
      location: {
        longitude: lng,
        latitude: lat
      },
      horizontal_distance: 2830,
      property_type: 'Residential',
      vertical_distance: 2830,
      minimum_square_meters: alert.minimum_square_meters,
      listing_statuses: alert.listing_statuses,
      minimum_lot_square_meters: alert.minimum_lot_square_meters,
      currency: 'USD',
      maximum_year_built: alert.maximum_year_built,
      minimum_year_built: alert.minimum_year_built,
      points: alert.points,
      minimum_bedrooms: alert.minimum_bedrooms,
      minimum_price: alert.minimum_price,
      open_house: alert.open_house,
      property_subtypes: alert.property_subtypes
    }
    ListingDispatcher.dispatch({
      action: 'get-valerts-alert',
      user: AppStore.data.user,
      options
    })
    ListingDispatcher.dispatch({
      action: 'get-alert-map',
      user: AppStore.data.user,
      room_id: alert.room,
      alert_id: alert.id
    })
    controller.acknowledgeNotifications(alert.id)
    // Fit points on map
    const google = window.google
    const bounds = new google.maps.LatLngBounds()
    alert.points.forEach(point => {
      const location = new google.maps.LatLng(point.latitude, point.longitude)
      bounds.extend(location)
    })
    window.map.fitBounds(bounds)
    const center = {
      lat: window.map.center.lat(),
      lng: window.map.center.lng()
    }
    AppStore.data.listing_map.center = center
    AppStore.data.listing_map.options = options
    AppStore.data.listing_map.auto_move = true
    AppStore.data.current_alert = alert
    AppStore.emitChange()
    controller.makePolygonAlert(alert.points)
    const history = require('../../../../utils/history')
    history.replaceState(null, '/dashboard/mls/alerts/' + alert.id)
  },
  makePolygonAlert(points) {
    const paths = points.map(path => {
      return {
        lat: path.latitude,
        lng: path.longitude
      }
    })
    if (window.poly) {
      window.poly.setMap(null)
      delete window.poly
    }
    const google = window.google
    let stroke_color = '#3388ff'
    if (AppStore.data.brand && AppStore.data.brand.primary)
      stroke_color = '#' + AppStore.data.brand.primary
    window.poly = new google.maps.Polygon({
      clickable: false,
      map: window.map,
      paths,
      strokeColor: stroke_color,
      strokeWeight: 10
    })
    window.poly_alerts = window.poly
  },
  showAlertViewer() {
    AppStore.data.show_alert_viewer = true
    AppStore.emitChange()
  },
  hideAlertViewer() {
    delete AppStore.data.show_alert_viewer
    AppStore.emitChange()
  }
}
export default controller