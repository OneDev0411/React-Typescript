// controller.js
import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'
import AppStore from '../../../../stores/AppStore'
import listing_util from '../../../../utils/listing'
import _ from 'lodash'

const controller = {
  initMap() {
    const data = AppStore.data
    const user = data.user
    let center = {
      lat: 32.7767,
      lng: -96.7970
    }
    let zoom = 15
    const options = {
      maximum_price: 5000000,
      limit: '75',
      maximum_lot_square_meters: 8.568721699047544e+17,
      minimum_bathrooms: 1,
      maximum_square_meters: 8.568721699047544e+17,
      location: {
        longitude: -96.79698789999998,
        latitude: 32.7766642
      },
      horizontal_distance: 2830,
      property_type: 'Residential',
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
      default_options: options,
      options,
      is_loading: true,
      center,
      zoom,
      google_options: {
        mapTypeControl: true,
        draggable: true
      }
    }
    AppStore.data.listing_map = listing_map
    AppStore.emitChange()
    ListingDispatcher.dispatch({
      action: 'get-valerts',
      user,
      options
    })
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
    AppStore.emitChange()
    ListingDispatcher.dispatch({
      action: 'get-valerts',
      user,
      options: listing_map.options
    })
  },

  setFilterOptions(e) {
    e.preventDefault()
    const data = AppStore.data
    const user = data.user
    const listing_map = data.listing_map
    /* Options
    ==================== */
    const options = listing_map.options
    const default_options = listing_map.default_options
    // Price
    // defaults
    options.minimum_price = default_options.minimum_price
    options.maximum_price = default_options.maximum_price
    const minimum_price = Number(this.refs.minimum_price.refs.input.value.trim())
    if (minimum_price)
      options.minimum_price = minimum_price
    const maximum_price = Number(this.refs.maximum_price.refs.input.value.trim())
    if (maximum_price)
      options.maximum_price = maximum_price
    // Size
    // defaults
    options.minimum_square_meters = 0
    options.maximum_square_meters = default_options.maximum_square_meters
    const minimum_square_feet = Number(this.refs.minimum_square_feet.refs.input.value.trim())
    if (minimum_square_feet)
      options.minimum_square_meters = listing_util.feetToMeters(minimum_square_feet)
    const maximum_square_feet = Number(this.refs.maximum_square_feet.refs.input.value.trim())
    if (maximum_square_feet)
      options.maximum_square_meters = listing_util.feetToMeters(maximum_square_feet)
    // Get filter options
    if (listing_map.filter_options) {
      const filter_options = listing_map.filter_options
      // Status
      const listing_statuses = []
      if (filter_options.sold)
        listing_statuses.push('Sold')
      if (filter_options.active)
        listing_statuses.push('Active')
      if (filter_options.other)
        listing_statuses.push('Active Contingent', 'Active Kick Out', 'Active Option Contract')
      options.listing_statuses = listing_statuses
      // Bed / bath
      options.minimum_bedrooms = default_options.minimum_bedrooms
      options.minimum_bathrooms = default_options.minimum_bathrooms
      const minimum_bedrooms = filter_options.minimum_bedrooms
      if (minimum_bedrooms)
        options.minimum_bedrooms = minimum_bedrooms
      const minimum_bathrooms = filter_options.minimum_bathrooms
      if (minimum_bathrooms)
        options.minimum_bathrooms = minimum_bathrooms
      // Pool
      const pool = filter_options.pool
      if (pool === 'either')
        delete options.pool
      else
        options.pool = pool
      // Property types
      if (filter_options.listing_types) {
        let property_subtypes = []
        if (filter_options.listing_types.includes('house'))
          property_subtypes.push('RES-Single Family')
        if (filter_options.listing_types.includes('condo'))
          property_subtypes.push('RES-Condo')
        if (filter_options.listing_types.includes('townhouse'))
          property_subtypes.push('RES-Townhouse')
        if (filter_options.listing_types.includes('any'))
          property_subtypes = ['RES-Single Family', 'RES-Half Duplex', 'RES-Farm\/Ranch', 'RES-Condo', 'RES-Townhouse']
        options.property_subtypes = property_subtypes
      }
    }
    AppStore.data.listing_map.is_loading = true
    AppStore.emitChange()
    ListingDispatcher.dispatch({
      action: 'get-valerts',
      user,
      options
    })
  },

  toggleListingPanel() {
    if (!AppStore.data.show_listing_panel) {
      AppStore.data.show_listing_panel = true
      AppStore.data.listing_panel = {
        view: 'photos'
      }
    } else {
      delete AppStore.data.show_listing_panel
      delete AppStore.data.listing_panel
    }
    AppStore.emitChange()
  },

  hideModal() {
    delete AppStore.data.listing_map.show_share_modal
    delete AppStore.data.show_modal_gallery
    AppStore.emitChange()
  },

  hideListingViewer() {
    delete AppStore.data.show_listing_viewer
    delete AppStore.data.current_listing
    AppStore.emitChange()
  },

  showPanelView(view) {
    if (AppStore.data.show_listing_panel && AppStore.data.listing_panel && AppStore.data.listing_panel.view === view) {
      delete AppStore.data.listing_panel
      delete AppStore.data.show_listing_panel
      AppStore.emitChange()
      return
    }
    AppStore.data.listing_panel = {
      view
    }
    if (!AppStore.data.show_listing_panel)
      AppStore.data.show_listing_panel = true
    delete AppStore.data.show_filter_form
    AppStore.emitChange()
  },

  sortListings(sort_by) {
    const data = AppStore.data
    const listings = data.listing_map.listings
    let sorting_direction = 1
    if (AppStore.data.listing_map.sorting_direction)
      sorting_direction = AppStore.data.listing_map.sorting_direction * -1
    const listings_sorted = _.sortBy(listings, listing => {
      if (sort_by === 'area')
        return listing.address.postal_code * sorting_direction
      if (sort_by === 'price')
        return listing.price * sorting_direction
      if (sort_by === 'bedroom_count')
        return listing.compact_property.bedroom_count * sorting_direction
      if (sort_by === 'bathroom_count')
        return listing.compact_property.bathroom_count * sorting_direction
      if (sort_by === 'square_meters')
        return listing.compact_property.square_meters * sorting_direction
      if (sort_by === 'year_built')
        return listing.compact_property.year_built * sorting_direction
      if (sort_by === 'dom')
        return listing_util.getDOM(listing.dom) * sorting_direction
      if (sort_by === 'price_per_square_foot')
        return (Math.floor(listing.price / listing_util.metersToFeet(listing.compact_property.square_meters))) * sorting_direction
    })
    AppStore.data.listing_map.listings = listings_sorted
    AppStore.data.listing_map.sorting_direction = sorting_direction
    AppStore.data.listing_map.sorting_by = sort_by
    AppStore.emitChange()
  },
// Start
  showFilterForm() {
    delete AppStore.data.listing_panel
    delete AppStore.data.show_listing_panel
    if (AppStore.data.show_filter_form)
      delete AppStore.data.show_filter_form
    else
      AppStore.data.show_filter_form = true
    AppStore.emitChange()
  },

  handleFilterSwitch(key) {
    if (!AppStore.data.listing_map.filter_options)
      AppStore.data.listing_map.filter_options = {}
    if (!AppStore.data.listing_map.filter_options[key])
      AppStore.data.listing_map.filter_options[key] = true
    else
      delete AppStore.data.listing_map.filter_options[key]
    AppStore.emitChange()
  },

  handleFilterButton(payload) {
    const key = payload.key
    const value = payload.value
    const filter_options = AppStore.data.listing_map.filter_options
    if (!filter_options)
      AppStore.data.listing_map.filter_options = {}
    if (key === 'listing_types') {
      let listing_types = []
      if (filter_options && filter_options.listing_types)
        listing_types = filter_options.listing_types
      // If has already, remove
      if (value === 'any') {
        if (listing_types.indexOf(value) === -1)
          listing_types = ['any', 'house', 'condo', 'townhouse']
        else
          listing_types = []
      } else {
        if (listing_types.indexOf(value) !== -1)
          _.pull(listing_types, value)
        else
          listing_types.push(value)
        _.pull(listing_types, 'any')
        if (listing_types.length === 3)
          listing_types.push('any')
      }
      AppStore.data.listing_map.filter_options.listing_types = listing_types
    }
    if (key === 'minimum_bedrooms' || key === 'minimum_bathrooms')
      AppStore.data.listing_map.filter_options[key] = Number(value)
    if (key === 'pool')
      AppStore.data.listing_map.filter_options[key] = value
    AppStore.emitChange()
  },

  resetFilterOptions() {
    const data = AppStore.data
    const user = data.user
    const listing_map = data.listing_map
    const default_options = listing_map.default_options
    AppStore.data.listing_map.filter_options = {
      maximum_price: 5000000,
      active: true,
      listing_types: ['house']
    }
    AppStore.emitChange()
    ListingDispatcher.dispatch({
      action: 'get-valerts',
      user,
      default_options
    })
  },

  handleOptionChange(key, value) {
    if (!AppStore.data.listing_map.filter_options)
      AppStore.data.listing_map.filter_options = {}
    AppStore.data.listing_map.filter_options[key] = value
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

  handleSearchSubmit(e) {
    if (window.poly) {
      window.poly.setMap(null)
      delete window.poly
      delete AppStore.data.listing_map.drawable
      AppStore.emitChange()
    }
    e.preventDefault()
    const data = AppStore.data
    const user = data.user
    const q = this.refs.search_input.value.trim()
    AppStore.data.listing_map.is_loading = true
    AppStore.emitChange()
    ListingDispatcher.dispatch({
      action: 'search-listing',
      user,
      q
    })
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
    AppStore.emitChange()
    controller.removeDrawing()
  },

  showShareModal() {
    delete AppStore.data.share_modal
    AppStore.data.listing_map.show_share_modal = true
    AppStore.emitChange()
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
      strokeColor: '#3388ff',
      strokeWeight: 10
    })
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
    controller.handleBoundsChange(center, zoom, bounds)
  },

  handleGoogleMapApi(google) {
    const map = google.map
    window.map = map
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
        strokeColor: '#3388ff',
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

  showListingViewer(listing) {
    const history = require('../../../../utils/history')
    history.replaceState(null, '/dashboard/mls/' + listing.id)
    const data = AppStore.data
    const user = data.user
    AppStore.data.show_listing_viewer = true
    AppStore.data.current_listing = listing
    AppStore.emitChange()
    ListingDispatcher.dispatch({
      action: 'get-listing',
      user,
      id: listing.id
    })
  },

  shareAlert(title) {
    delete AppStore.data.error
    AppStore.emitChange()
    const data = AppStore.data
    const listing_map = data.listing_map
    const alert = listing_map.options
    const user = data.user
    const share_list = data.share_list
    if (!title) {
      AppStore.data.error = {
        message: 'You must name this alert'
      }
      AppStore.emitChange()
      return
    }
    if (!share_list || share_list && !share_list.rooms.length && !share_list.contacts.length) {
      AppStore.data.error = {
        message: 'You must choose at least one room or one contact.'
      }
      AppStore.emitChange()
      return
    }
    alert.title = title
    ListingDispatcher.dispatch({
      action: 'share-alert',
      user,
      rooms: share_list.rooms,
      contacts: share_list.contacts,
      alert
    })
  },

  setActiveListing(listing) {
    AppStore.data.listing_map.active_listing = listing.id
    AppStore.emitChange()
  },

  removeActiveListing() {
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
  },

  showModalGallery(image_url) {
    if (!image_url)
      return
    const data = AppStore.data
    const gallery_image_urls = data.current_listing.gallery_image_urls
    const image_index = gallery_image_urls.indexOf(image_url)
    AppStore.data.show_modal_gallery = true
    AppStore.data.modal_gallery = {
      current_index: image_index,
      gallery_image_urls
    }
    AppStore.emitChange()
  },

  handleModalGalleryNav(selectedIndex, selectedDirection) {
    const data = AppStore.data
    const gallery_image_urls = data.current_listing.gallery_image_urls
    const current_index = AppStore.data.modal_gallery.current_index
    if (selectedDirection === 'prev')
      AppStore.data.modal_gallery.current_index = current_index - 1
    if (selectedDirection === 'next')
      AppStore.data.modal_gallery.current_index = current_index + 1
    if (AppStore.data.modal_gallery.current_index === -1)
      AppStore.data.modal_gallery.current_index = gallery_image_urls.length - 1
    if (AppStore.data.modal_gallery.current_index === gallery_image_urls.length)
      AppStore.data.modal_gallery.current_index = 0
    AppStore.data.modal_gallery.direction = selectedDirection
    AppStore.emitChange()
  },

  itemAdded(type, item) {
    const data = AppStore.data
    if (!data.share_modal)
      return false
    const share_modal = data.share_modal
    if (type === 'room')
      return _.find(share_modal.rooms_added, { id: item.id })
    if (type === 'contact')
      return _.find(share_modal.contacts_added, { id: item.id })
    return false
  },

  handleShareFilter(text) {
    if (!text) {
      controller.removeShareFilter()
      return
    }
    if (!AppStore.data.share_modal)
      AppStore.data.share_modal = {}
    AppStore.data.share_modal.filter_text = text
    AppStore.emitChange()
    const data = AppStore.data
    const rooms = data.rooms
    const contacts = data.contacts
    const text_lower = text.toLowerCase()
    const rooms_filtered = rooms.filter(room => {
      if (controller.itemAdded('room', room))
        return false
      if (room.title && room.title.toLowerCase().indexOf(text_lower) !== -1)
        return true
      return false
    })
    const contacts_filtered = contacts.filter(contact => {
      if (controller.itemAdded('contact', contact))
        return false
      if (contact.first_name && contact.first_name.toLowerCase().indexOf(text_lower) !== -1)
        return true
      if (contact.last_name && contact.last_name.toLowerCase().indexOf(text_lower) !== -1)
        return true
      if (contact.email && contact.email.toLowerCase().indexOf(text_lower) !== -1)
        return true
      if (contact.phone_number && contact.phone_number && contact.phone_number.indexOf(text_lower) !== -1)
        return false
      return false
    })
    AppStore.data.share_modal.rooms_filtered = rooms_filtered
    AppStore.data.share_modal.contacts_filtered = contacts_filtered
    AppStore.emitChange()
  },

  removeShareFilter() {
    if (!AppStore.data.share_modal)
      return
    delete AppStore.data.share_modal.filter_text
    delete AppStore.data.share_modal.rooms_filtered
    delete AppStore.data.share_modal.contacts_filtered
    AppStore.emitChange()
  },

  addToShareList(type, item) {
    const data = AppStore.data
    const share_modal = data.share_modal
    if (!share_modal.rooms_added)
      share_modal.rooms_added = []
    if (!share_modal.contacts_added)
      share_modal.contacts_added = []
    // Rooms
    if (type === 'rooms') {
      // Test if already added
      if (_.find(share_modal.rooms_added, { id: item.id }))
        return
      share_modal.rooms_added.push(item)
    }
    // Contacts
    if (type === 'contacts') {
      // Test if already added
      if (_.find(share_modal.contacts_added, { id: item.id }))
        return
      share_modal.contacts_added.push(item)
    }
    AppStore.data.share_modal = share_modal
    controller.removeShareFilter()
    delete AppStore.data.share_modal.filter_text
    AppStore.emitChange()
  }
}

export default controller