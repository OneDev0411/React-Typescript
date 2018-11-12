// controller/listing-map.js
import { primary } from 'views/utils/colors'

import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'
import AppStore from '../../../../stores/AppStore'
import Brand from '../../../../controllers/Brand'

let mapBoundsOnChangeDelay = null

const controller = {
  initMap() {
    const { data } = AppStore

    let center = {
      lat: 32.7767,
      lng: -96.7970
    }

    let zoom = 13

    const options = {
      limit: '500',
      currency: 'USD',
      open_house: false,
      vertical_distance: 2830,
      horizontal_distance: 2830,
      property_types: ['Residential'],
      listing_statuses: [
        'Active',
        'Active Kick Out',
        'Active Contingent',
        'Active Option Contract'
      ],
      location: {
        longitude: -96.79698789999998,
        latitude: 32.7766642
      },
      points: [
        {
          latitude: 32.83938955111425,
          longitude: -96.89115626525879
        },
        {
          latitude: 32.83938955111425,
          longitude: -96.70284373474121
        },
        {
          latitude: 32.71396625328302,
          longitude: -96.70284373474121
        },
        {
          latitude: 32.71396625328302,
          longitude: -96.89115626525879
        },
        {
          latitude: 32.83938955111425,
          longitude: -96.89115626525879
        }
      ],
      property_subtypes: [
        'RES-Single Family',
        'RES-Half Duplex',
        'RES-Farm\/Ranch',
        'RES-Condo',
        'RES-Townhouse'
      ],
      maximum_year_built: new Date().getFullYear()
    }

    if (
      data.listing_map !== undefined && data.listing_map.center !== undefined
    ) {
      center = data.listing_map.center
      zoom = data.listing_map.zoom
    }

    const listing_map = {
      zoom,
      center,
      options,
      is_loading: true,
      google_options: {
        mapTypeControl: false,
        draggable: true
      },
      map_id: new Date().getTime(),
      default_options: { ...options },
      filter_options: {
        sold: false,
        active: true,
        other: false,
        open_houses: false,
        listing_types: ['any'],
        status_options: {
          active: [
            'Active',
            'Active Contingent',
            'Active Kick Out',
            'Active Option Contract'
          ]
        },
        minimum_bedrooms: 0,
        minimum_bathrooms: 0,
        minimum_parking_spaces: 0,
        pool: 'either'
      }
    }

    AppStore.data = {
      ...AppStore.data,
      listing_map
    }
    AppStore.emitChange()
  },

  createMapOptions() {
    const { data } = AppStore
    const { listing_map } = data

    const google_options = {
      mapTypeControl: false,
      draggable: true
    }

    if (listing_map == null) {
      return google_options
    }

    // set disable default ui
    google_options.disableDefaultUI = true

    AppStore.data.listing_map = {
      ...AppStore.data.listing_map,
      google_options
    }
    AppStore.emitChange()

    return google_options
  },

  handleBoundsChange(gmap) {
    const { data } = AppStore
    const { user, listing_map } = data
    const { bounds, center, zoom, size, marginBounds } = gmap

    if (!listing_map) {
      return
    }

    if (!bounds) {
      return
    }

    if (listing_map.auto_move) {
      return
    }

    const points = [
      {
        latitude: bounds.ne.lat,
        longitude: bounds.ne.lng
      },
      {
        latitude: bounds.nw.lat,
        longitude: bounds.nw.lng
      },
      {
        latitude: bounds.sw.lat,
        longitude: bounds.sw.lng
      },
      {
        latitude: bounds.se.lat,
        longitude: bounds.se.lng
      },
      {
        latitude: bounds.ne.lat,
        longitude: bounds.ne.lng
      }
    ]

    if (!window.poly && !data.show_alerts_map && !data.show_actives_map) {
      AppStore.data.listing_map.is_loading = true

      const options = {
        ...listing_map.options,
        points
      }

      AppStore.data.listing_map = {
        ...listing_map,
        options,
        center,
        zoom
      }

      AppStore.data.gmap = {
        ...AppStore.data.gmap,
        ...gmap
      }

      // console.log('changeeeeeeeeeeeeeeeeee')

      if (!mapBoundsOnChangeDelay) {
        // console.log('empty timeout')
        mapBoundsOnChangeDelay = 1

        ListingDispatcher.dispatch({
          user,
          options,
          action: 'get-valerts'
        })
      } else {
        clearTimeout(mapBoundsOnChangeDelay)
        // console.log('dealy cleared', mapBoundsOnChangeDelay)

        mapBoundsOnChangeDelay = setTimeout(() => {
          // console.log('set timeout for valert req')

          ListingDispatcher.dispatch({
            user,
            options,
            action: 'get-valerts'
          })
          clearTimeout(mapBoundsOnChangeDelay)
        }, 300)
      } // else
    } // if
  },

  hideModal() {
    if (AppStore.data.listing_map) {
      delete AppStore.data.listing_map.saving_alert
    }

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

    if (type === 'in') {
      AppStore.data.listing_map.zoom = current_zoom + 1
    }

    if (type === 'out') {
      AppStore.data.listing_map.zoom = current_zoom - 1
    }

    AppStore.emitChange()
  },

  handleRemoveListings() {
    delete AppStore.data.listing_map.listings
    delete AppStore.data.listing_map.has_search_input
    AppStore.emitChange()
    controller.removeDrawing()
  },

  getValertsInArea(points) {
    const { data } = AppStore
    const { user, listing_map } = data

    const options = {
      ...listing_map.options,
      points
    }

    const google_options = {
      ...listing_map.google_options,
      draggable: true
    }

    const is_loading = true

    AppStore.data.listing_map = {
      ...listing_map,
      google_options,
      is_loading,
      options
    }

    AppStore.emitChange()

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
      strokeColor: Brand.color('primary', primary),
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
    const points = [...coordinates, coordinates[0]]
    return points
  },

  removeDrawing() {
    if (!window.poly) {
      return
    }

    window.poly.setMap(null)
    delete AppStore.data.listing_map.drawable
    AppStore.emitChange()

    delete window.poly
    delete window.poly_search
    controller.handleBoundsChange(AppStore.data.gmap)
  },

  handleGoogleMapApi(google) {
    const { data } = AppStore
    const { listing_map } = data

    const { map } = google
    window.map = map
    window.map.set('mapTypeControl', false)

    if (listing_map && listing_map.drawable && window.poly) {
      controller.makePolygon()
    }

    google.maps.event.addDomListener(map.getDiv(), 'mousedown', () => {
      const { listing_map } = AppStore.data
      const mapIsDrawable = listing_map && listing_map.drawable

      if (!mapIsDrawable || (mapIsDrawable && window.poly)) {
        return
      }

      window.poly = new google.maps.Polyline({
        map,
        clickable: false,
        strokeWeight: 10,
        strokeColor: Brand.color('primary', primary)
      })

      AppStore.data.listing_map.no_popup = true
      AppStore.emitChange()

      const move = google.maps.event.addListener(map, 'mousemove', (e) => {
        if (!mapIsDrawable) {
          window.poly.setMap(null)
          return false
        }

        window.poly.getPath().push(e.latLng)
        return false
      })

      google.maps.event.addListenerOnce(map, 'mouseup', () => {
        delete AppStore.data.listing_map.no_popup
        AppStore.emitChange()

        if (!mapIsDrawable) {
          return
        }

        map.set('draggable', true)
        google.maps.event.removeListener(move)

        controller.makePolygon()
        const points = controller.getPolygonBounds(google, window.poly)
        controller.getValertsInArea(points)
      })
    })
  },

  setActiveListing(listing) {
    const active_listing = listing && listing.id
    AppStore.data.listing_map = {
      ...AppStore.data.listing_map,
      active_listing
    }
    AppStore.emitChange()
  },

  removeActiveListing() {
    if (AppStore.data.listing_map) {
      delete AppStore.data.listing_map.active_listing
    }
    AppStore.emitChange()
  },

  showListingPopup(listing) {
    const data = AppStore.data
    const listing_map = data.listing_map
    if (listing_map.no_popup) {
      return
    }
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
