// controller/alert-map.js
import AppStore from '../../../../stores/AppStore'
import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'
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
