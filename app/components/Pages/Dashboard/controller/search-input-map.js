// controller/search-input-map.js
import AppDispatcher from '../../../../dispatcher/AppDispatcher'
import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'
import AppStore from '../../../../stores/AppStore'
import listing_viewer_controller from './listing-viewer'

const controller = {
  handleSearchInputChange(e) {
    const search_input_text = e.target.value

    if (search_input_text.length === 0)
      delete AppStore.data.listing_map.has_search_input

    if (/^\d{5}(?:[-\s]\d{4})?$/.test(search_input_text)) {
      const options = AppStore.data.listing_map.options
      options.points = null
      options.mls_areas = null
      options.school_districts = null
      options.counties = null
      options.postal_codes = [search_input_text]
      ListingDispatcher.dispatch({
        action: 'get-valerts',
        user: AppStore.data.user,
        options
      })
    }

    AppStore.data.listing_map.search_input_text = search_input_text
    AppStore.emitChange()
  },
  initGoogleSearch() {
    const google = window.google
    const autocomplete = new google.maps
      .places
      .Autocomplete(document.getElementById('google_search'))

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
      console.log('changeeee palce')
      const place = autocomplete.getPlace()
      // Do async search for single listing
      // ListingDispatcher.dispatch({
      //   action: 'search-listing-input',
      //   user: AppStore.data.user,
      //   q: place.name
      // })
      // Check if MLS number
      if (!isNaN(place.name) && place.name.length > 7) {
        AppStore.data.listing_map.is_loading = true
        // console.log(place.name) // 13362991
        AppStore.emitChange()
        ListingDispatcher.dispatch({
          action: 'search-listing-map',
          user: AppStore.data.user,
          q: place.name
        })
        return
      }
      if (!place.formatted_address) {
        AppStore.data.listing_map.is_loading = true
        AppStore.emitChange()
        // Do zip test
        // if (isValidUSZip(place.name)) {
        //   const options = AppStore.data.listing_map.options
        //   options.postal_codes = [place.name]
        //   options.points = null
        //   ListingDispatcher.dispatch({
        //     action: 'get-valerts',
        //     user: AppStore.data.user,
        //     options
        //   })
        //   return
        // }
        AppDispatcher.dispatch({
          action: 'geocode-address',
          address: place.name
        })
        return
      }
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
    })
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
  handleSearchSubmit(e) {
    e.preventDefault()
    // if (window.poly) {
    //   window.poly.setMap(null)
    //   delete window.poly
    //   delete AppStore.data.listing_map.drawable
    //   AppStore.emitChange()
    // }
    // e.preventDefault()
    // const data = AppStore.data
    // const user = data.user
    // const q = AppStore.data.listing_map.search_input_text.trim()
    // AppStore.data.listing_map.is_loading = true
    // const listing_map = data.listing_map
    // const options = listing_map.options
    // const status = options.listing_statuses.join(',')
    // AppStore.emitChange()
    // ListingDispatcher.dispatch({
    //   action: 'search-listing-map',
    //   user,
    //   q,
    //   status
    // })
  },
  handleKeyDown(e) {
    const data = AppStore.data
    const q = encodeURIComponent(e.target.value)
    if (!data.search_input)
      return
    if (e.which === 13)
      controller.handleListingClick(q)
    const listings = data.search_input.listings
    if (typeof data.search_input.active_listing === 'undefined')
      AppStore.data.search_input.active_listing = -1
    // Down
    if (e.which === 40) {
      if (data.search_input.active_listing === listings.length - 1)
        AppStore.data.search_input.active_listing = 0
      else
        AppStore.data.search_input.active_listing = data.search_input.active_listing + 1
    }
    // Up
    if (e.which === 38) {
      if (!data.search_input.active_listing)
        AppStore.data.search_input.active_listing = listings.length - 1
      else
        AppStore.data.search_input.active_listing = data.search_input.active_listing - 1
    }
    AppStore.emitChange()
  }
}
export default controller
