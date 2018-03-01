// controller/alert-map.js
import AppStore from '../../../../stores/AppStore'
import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'
import ContactModel from '../../../../models/contacts'
import AppDispatcher from '../../../../dispatcher/AppDispatcher'
import Brand from '../../../../controllers/Brand'

const controller = {
  alertHasNotifications(alert_id) {
    let result = false
    const data = AppStore.data

    if (!data.notifications) {
      return false
    }

    // TODO refactor notifications
    let summaries

    if (data.notifications && data.notifications.summary) {
      summaries = data.notifications.summary.room_notification_summaries
    }

    if (!summaries) {
      return false
    }

    summaries.forEach(summary => {
      const user_created_alert_ids = summary.user_created_alert_ids

      if (
        user_created_alert_ids &&
        user_created_alert_ids.indexOf(alert_id) !== -1
      ) {
        result = true
      }
    })

    return result
  },

  acknowledgeNotifications(alert_id) {
    if (!this.alertHasNotifications(alert_id)) {
      return
    }

    const data = AppStore.data
    const user = data.user

    AppDispatcher.dispatch({
      action: 'acknowledge-alert-notifications',
      user,
      alert_id
    })
  },

  getBounds(points) {
    const google = window.google
    const bound = new google.maps.LatLngBounds()

    points.forEach(point => {
      bound.extend(new google.maps.LatLng(point.latitude, point.longitude))
    })

    return bound.getCenter()
  },

  showAlertOnMap(alert) {
    const { user } = AppStore.data

    // update user timeline
    if (alert) {
      ContactModel.updateUserTimeline('UserViewedAlert', 'Alert', alert.id)
    }

    let center_from_points
    let lat
    let lng

    if (alert.points) {
      center_from_points = controller.getBounds(alert.points)
      lat = center_from_points.lat()
      lng = center_from_points.lng()
    }

    const options = {
      maximum_price: alert.maximum_price,
      limit: '500',
      maximum_lot_square_meters: alert.maximum_lot_square_meters,
      minimum_bathrooms: alert.minimum_bathrooms,
      maximum_square_meters: alert.maximum_square_meters,
      horizontal_distance: 2830,
      property_types: ['Residential'],
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

    if (center_from_points) {
      options.location = {
        longitude: lng,
        latitude: lat
      }
    }

    if (alert.mls_areas) {
      const mls_areas = []

      alert.mls_areas.forEach(mls_area => {
        mls_areas.push([mls_area.number, mls_area.parent])
      })
      options.mls_areas = mls_areas
      options.points = null
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

    // Reset poly
    if (window.poly) {
      window.poly.setMap(null)
      delete window.poly
    }

    if (alert.points) {
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
    }

    AppStore.data.listing_map.options = options
    AppStore.data.listing_map.auto_move = true
    AppStore.data.current_alert = alert
    AppStore.emitChange()

    if (alert.points) {
      controller.makePolygonAlert(alert.points)
    }

    const history = require('../../../../utils/history')

    history.default.push(`/dashboard/mls/alerts/${alert.id}`)

    if (AppStore.data.show_alert_viewer) {
      controller.markAsRead(alert.id, alert.room)
    }

    // Go to gallery view
    controller.showAlertViewer()
  },

  makePolygonAlert(points) {
    const paths = points.map(path => ({
      lat: path.latitude,
      lng: path.longitude
    }))

    if (window.poly) {
      window.poly.setMap(null)
      delete window.poly
    }

    const google = window.google

    window.poly = new google.maps.Polygon({
      clickable: false,
      map: window.map,
      paths,
      strokeColor: `#${Brand.color('primary', '3388ff')}`,
      strokeWeight: 10
    })
    window.poly_alerts = window.poly
  },

  markAsRead(alert_id, room_id) {
    const data = AppStore.data
    const user = data.user

    ListingDispatcher.dispatch({
      action: 'mark-recs-as-read',
      alert_id,
      room_id,
      user
    })
  },

  showAlertViewer() {
    AppStore.data.show_alert_viewer = true

    const data = AppStore.data
    const current_alert = data.current_alert

    controller.markAsRead(current_alert.id, current_alert.room)
    AppStore.emitChange()
  },

  hideAlertViewer() {
    AppStore.data.show_alert_viewer = false
    AppStore.emitChange()
  }
}

export default controller
