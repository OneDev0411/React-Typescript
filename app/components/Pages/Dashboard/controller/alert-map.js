// controller/alert-map.js
import AppStore from '../../../../stores/AppStore'
const controller = {
  showAlertOnMap(alert) {
    const lat = alert.location.latitude
    const lng = alert.location.longitude
    AppStore.data.listing_map.center = {
      lat,
      lng
    }
    AppStore.emitChange()
  }
}
export default controller