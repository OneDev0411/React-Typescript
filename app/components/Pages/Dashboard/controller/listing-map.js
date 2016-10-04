// controller/listing-map.js
import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'
import AppStore from '../../../../stores/AppStore'
import Brand from '../../../../controllers/Brand'

const controller = {
  initMap() {
    const data = AppStore.data
    let center = {
      lat: 32.7767,
      lng: -96.7970
    }
    let zoom = 13
    const options = {
      limit: '75',
      maximum_lot_square_meters: 100000000,
      minimum_bathrooms: 0,
      minimum_parking_spaces: 0,
      location: {
        longitude: -96.79698789999998,
        latitude: 32.7766642
      },
      horizontal_distance: 2830,
      property_types: ['Residential'],
      vertical_distance: 2830,
      minimum_square_meters: 0,
      listing_statuses: ['Active', 'Active Contingent', 'Active Kick Out', 'Active Option Contract'],
      minimum_lot_square_meters: 0,
      currency: 'USD',
      maximum_year_built: 2016,
      minimum_year_built: 0,
      points: [{
        latitude: 32.83938955111425,
        longitude: -96.89115626525879
      }, {
        latitude: 32.83938955111425,
        longitude: -96.70284373474121
      }, {
        latitude: 32.71396625328302,
        longitude: -96.70284373474121
      }, {
        latitude: 32.71396625328302,
        longitude: -96.89115626525879
      }, {
        latitude: 32.83938955111425,
        longitude: -96.89115626525879
      }],
      minimum_bedrooms: 0,
      minimum_price: 0,
      open_house: false,
      property_subtypes: ['RES-Single Family', 'RES-Half Duplex', 'RES-Farm\/Ranch', 'RES-Condo', 'RES-Townhouse']
    }
    if (data.listing_map && data.listing_map.center) {
      center = data.listing_map.center
      zoom = data.listing_map.center
    }
    const listing_map = {
      map_id: new Date().getTime(),
      default_options: { ...options },
      options,
      is_loading: true,
      center,
      zoom,
      google_options: {
        mapTypeControl: true,
        draggable: true
      },
      filter_options: {
        sold: false,
        active: true,
        other: false,
        open_houses: false,
        listing_types: ['any'],
        status_options: {
          active: ['Active', 'Active Contingent', 'Active Kick Out', 'Active Option Contract']
        },
        minimum_bedrooms: 0,
        minimum_bathrooms: 0,
        minimum_parking_spaces: 0,
        pool: 'either'
      }
    }
    AppStore.data.listing_map = listing_map
    AppStore.emitChange()
  },
  createMapOptions() {
    const data = AppStore.data
    const listing_map = data.listing_map
    if (!listing_map) {
      return {
        mapTypeControl: true,
        draggable: true
      }
    }
    const google_options = {
      disableDefaultUI: true,
      mapTypeControl: true,
      draggable: true
    }
    AppStore.data.listing_map.google_options = google_options
    AppStore.emitChange()
    return google_options
  },
  handleBoundsChange(center, zoom, bounds) {
    const data = AppStore.data
    const user = data.user
    const listing_map = data.listing_map
    if (!listing_map)
      return
    const auto_move = listing_map.auto_move
    if (auto_move)
      return
    const points = [
      {
        latitude: bounds[0],
        longitude: bounds[1]
      },
      {
        latitude: bounds[0],
        longitude: bounds[3]
      },
      {
        latitude: bounds[2],
        longitude: bounds[3]
      },
      {
        latitude: bounds[2],
        longitude: bounds[1]
      },
      {
        latitude: bounds[0],
        longitude: bounds[1]
      }
    ]
    AppStore.data.listing_map.center = center
    AppStore.data.listing_map.zoom = zoom
    // Don't get more results if polygon on map
    if (!window.poly) {
      AppStore.data.listing_map.is_loading = true
      AppStore.data.listing_map.options.points = points
    }
    // Get options
    // Zoom fix
    // if (listing_map.options.mls_areas || listing_map.options.school_districts || listing_map.options.counties) {
    //   if (!listing_map.search_area_on_move)
    //     AppStore.data.listing_map.search_area_on_move = true
    //   else {
    //     delete listing_map.options.mls_areas
    //     delete listing_map.options.school_districts
    //     delete listing_map.options.counties
    //     delete AppStore.data.listing_map.search_area_on_move
    //   }
    //   AppStore.emitChange()
    // }
    ListingDispatcher.dispatch({
      action: 'get-valerts',
      user,
      options: listing_map.options
    })
  },
  hideModal() {
    if (AppStore.data.listing_map)
      delete AppStore.data.listing_map.saving_alert
    delete AppStore.data.show_share_listing_modal
    delete AppStore.data.show_alert_saved_modal
    delete AppStore.data.show_listing_shared_modal
    if (AppStore.data.listing_map) {
      delete AppStore.data.listing_map.show_share_modal
      delete AppStore.data.listing_map.show_share_type_modal
      delete AppStore.data.listing_map.show_share_alert_error_tooltip
    }
    delete AppStore.data.show_modal_gallery
    setTimeout(() => {
      delete AppStore.data.share_modal
    }, 500)
    AppStore.emitChange()
  },
  toggleDrawable() {
    if (AppStore.data.listing_map.drawable) {
      delete AppStore.data.listing_map.drawable
      window.map.set('draggable', true)
      controller.removeDrawing()
    } else {
      AppStore.data.listing_map.drawable = true
      window.map.set('draggable', false)
    }
    AppStore.emitChange()
  },
  handleZoomClick(type) {
    const current_zoom = AppStore.data.listing_map.zoom
    if (type === 'in')
      AppStore.data.listing_map.zoom = current_zoom + 1
    if (type === 'out')
      AppStore.data.listing_map.zoom = current_zoom - 1
    AppStore.emitChange()
  },
  handleRemoveListings() {
    delete AppStore.data.listing_map.listings
    delete AppStore.data.listing_map.has_search_input
    AppStore.emitChange()
    controller.removeDrawing()
  },
  getValertsInArea(points) {
    const data = AppStore.data
    const user = data.user
    const options = AppStore.data.listing_map.options
    options.points = points
    AppStore.data.listing_map.google_options.draggable = true
    AppStore.data.listing_map.is_loading = true
    ListingDispatcher.dispatch({
      action: 'get-valerts',
      user,
      options
    })
  },
  makePolygon() {
    const google = window.google
    const map = window.map
    const path = window.poly.getPath()
    window.poly.setMap(null)

    window.poly = new google.maps.Polygon({
      clickable: false,
      map,
      path,
      strokeColor: '#' + Brand.color('primary', '3388ff'),
      strokeWeight: 10
    })
    window.poly_search = window.poly
  },
  getPolygonBounds(google, polygon) {
    const polygon_bounds = polygon.getPath()
    const coordinates = []
    let lat_lng
    for (let i = 0; i < polygon_bounds.length; i++) {
      lat_lng = {
        latitude: polygon_bounds.getAt(i).lat(),
        longitude: polygon_bounds.getAt(i).lng()
      }
      coordinates.push(lat_lng)
    }
    const points = [
      ...coordinates,
      coordinates[0]
    ]
    return points
  },
  removeDrawing() {
    if (!window.poly)
      return
    window.poly.setMap(null)
    delete AppStore.data.listing_map.drawable
    AppStore.emitChange()
    let center = window.map.getCenter()
    center = {
      lat: center.lat(),
      lng: center.lng()
    }
    const zoom = window.map.getZoom()
    let bounds = window.map.getBounds()
    bounds = [
      bounds.getNorthEast().lat(),
      bounds.getSouthWest().lng(),
      bounds.getSouthWest().lat(),
      bounds.getNorthEast().lng()
    ]
    delete window.poly
    delete window.poly_search
    controller.handleBoundsChange(center, zoom, bounds)
  },
  handleGoogleMapApi(google) {
    const map = google.map
    window.map = map
    window.map.set('mapTypeControl', false)
    const data = AppStore.data
    const listing_map = data.listing_map
    if (listing_map.drawable && window.poly)
      controller.makePolygon()
    google.maps.event.addDomListener(map.getDiv(), 'mousedown', () => {
      if (!listing_map.drawable || listing_map.drawable && window.poly)
        return

      window.poly = new google.maps.Polyline({
        map,
        clickable: false,
        strokeColor: '#' + Brand.color('primary', '3388ff'),
        strokeWeight: 10
      })
      AppStore.data.listing_map.no_popup = true
      AppStore.emitChange()
      const move = google.maps.event.addListener(map, 'mousemove', e => {
        if (!listing_map.drawable) {
          window.poly.setMap(null)
          return false
        }
        window.poly.getPath().push(e.latLng)
        return false
      })
      google.maps.event.addListenerOnce(map, 'mouseup', () => {
        delete AppStore.data.listing_map.no_popup
        AppStore.emitChange()
        if (!listing_map.drawable)
          return
        map.set('draggable', true)
        google.maps.event.removeListener(move)
        controller.makePolygon()
        const points = controller.getPolygonBounds(google, window.poly)
        controller.getValertsInArea(points)
      })
    })
  },
  setActiveListing(listing) {
    AppStore.data.listing_map.active_listing = listing.id
    AppStore.emitChange()
  },
  removeActiveListing() {
    if (AppStore.data.listing_map)
      delete AppStore.data.listing_map.active_listing
    AppStore.emitChange()
  },
  showListingPopup(listing) {
    const data = AppStore.data
    const listing_map = data.listing_map
    if (listing_map.no_popup)
      return
    controller.setActiveListing(listing)
    AppStore.data.listing_map.listing_popup = listing.id
    AppStore.emitChange()
  },
  hideListingPopup() {
    controller.removeActiveListing()
    delete AppStore.data.listing_map.listing_popup
    AppStore.emitChange()
  }
}
export default controller