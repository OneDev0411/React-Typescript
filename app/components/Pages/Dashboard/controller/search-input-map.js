// controller/search-input-map.js
import AppDispatcher from '../../../../dispatcher/AppDispatcher'
import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'
import AppStore from '../../../../stores/AppStore'
import listing_viewer_controller from './listing-viewer'

const getGeoCode = (place) => {
  AppStore.data.listing_map.is_loading = true
  AppStore.emitChange()

  AppDispatcher.dispatch({
    action: 'geocode-address',
    address: place.name
  })
}

const autoCompleteHandler = (place) => {
  if (!place.formatted_address) {
    // console.log('submit search: place_changed: unformated', place)
    getGeoCode(place)
    return
  }

  // console.log('submit search: place_changed formated', place)

  AppStore.data.listing_map.search_input_text = place.formatted_address
  const center = {
    lat: place.geometry.location.lat(),
    lng: place.geometry.location.lng()
  }
  AppStore.data.listing_map.center = center
  AppStore.data.listing_map.zoom = 15
  AppStore.data.listing_map.has_location_search = true
  AppStore.data.listing_map.location_search = {
    center
  }
  AppStore.emitChange()
}

const removePoly = () => {
  if (window.poly_search) {
    window.poly.setMap(null)
    delete AppStore.data.listing_map.drawable
    delete window.poly
    delete window.poly_search
    AppStore.emitChange()
  }
}

const controller = {
  handleSearchInputChange(e) {
    const input = e.target.value

    if (input.length === 0) {
      delete AppStore.data.listing_map.has_search_input
    }

    AppStore.data.listing_map.search_input_text = input
    AppStore.emitChange()
  },

  initGoogleSearch() {
    const google = window.google
    const autocomplete = new google.maps
      .places
      .Autocomplete(document.getElementById('google_search'))

    window.googleMapAutocomplete = autocomplete

    const geolocation = {
      lat: AppStore.data.listing_map.center.lat,
      lng: AppStore.data.listing_map.center.lng
    }
    const circle = new google.maps.Circle({
      center: geolocation,
      radius: 500
    })

    autocomplete.setBounds(circle.getBounds())

    autocomplete.addListener('place_changed', () => {
      autoCompleteHandler(autocomplete.getPlace())
    })
  },

  handleSearchSubmit(e) {
    e.preventDefault()
    removePoly()

    const input = AppStore.data.listing_map.search_input_text

    if (!input) {
      return
    }

    if (/^\d{5}(?:[-\s]\d{4})?$/.test(input)) {
      // console.log('submit search: post code', input)
      getGeoCode({ name: input })
      return
    }

    if (!isNaN(input) && input.length > 7) {
      // console.log('submit search: MLS Number', input)
      AppStore.data.listing_map.is_loading = true
      AppStore.emitChange()

      ListingDispatcher.dispatch({
        action: 'search-mls-number',
        user: AppStore.data.user,
        q: input
      })
    }

    // if (window.googleMapAutocomplete) {
    //   console.log(googleMapAutocomplete)
    //   debugger
    //   const place = window.googleMapAutocomplete.getPlace() || { name: input }
    //   autoCompleteHandler(place)
    // }
  },

  handleListingClick() {
    const data = AppStore.data
    const search_input = data.search_input
    // Send to full listing
    if (search_input && search_input.listings && typeof search_input.active_listing !== 'undefined') {
      const listing = search_input.listings[search_input.active_listing]
      listing_viewer_controller.showListingViewer(listing)
      return
    }
    // Send to geobound search on map
    controller.handleSearchSubmit()
  },

  handleKeyDown(e) {
    const data = AppStore.data
    const q = encodeURIComponent(e.target.value)
    if (!data.search_input) {
      return
    }

    if (e.which === 13) {
      controller.handleListingClick(q)
    }

    const listings = data.search_input.listings
    if (typeof data.search_input.active_listing === 'undefined') {
      AppStore.data.search_input.active_listing = -1
    }

    // Down
    if (e.which === 40) {
      if (data.search_input.active_listing === listings.length - 1) {
        AppStore.data.search_input.active_listing = 0
      } else {
        AppStore.data.search_input.active_listing = data.search_input.active_listing + 1
      }
    }

    // Up
    if (e.which === 38) {
      if (!data.search_input.active_listing) {
        AppStore.data.search_input.active_listing = listings.length - 1
      } else {
        AppStore.data.search_input.active_listing = data.search_input.active_listing - 1
      }
    }
    AppStore.emitChange()
  }
}

export default controller
