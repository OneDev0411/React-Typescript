// controller/alert-map.js
import AppStore from '../../../../stores/AppStore'
import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'
const controller = {
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
    AppStore.data.listing_map.current_alert = alert
    AppStore.emitChange()
  }
}
export default controller