// controller/search-input-map.js
import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'
import AppStore from '../../../../stores/AppStore'
import listing_viewer_controller from './listing-viewer'
const controller = {
  handleSearchInputChange(e) {
    const search_input_text = this.refs.search_input.value
    AppStore.data.listing_map.search_input_text = search_input_text
    AppStore.emitChange()
    if (!search_input_text.length)
      delete AppStore.data.listing_map.has_search_input
    AppStore.emitChange()
    // Reset up / down
    if (AppStore.data.search_input) {
      delete AppStore.data.search_input.active_listing
      AppStore.emitChange()
    }
    const q = e.target.value
    if (!AppStore.data.search_input)
      AppStore.data.search_input = {}
    AppStore.data.search_input.q = q
    AppStore.emitChange()
    if (!q.trim()) {
      delete AppStore.data.search_input.listings
      AppStore.emitChange()
      return
    }
    // Throttle
    AppStore.data.search_input.is_loading = true
    AppStore.emitChange()
    if (AppStore.data.search_input && AppStore.data.search_input.typing)
      return
    AppStore.data.search_input.typing = true
    AppStore.emitChange()
    setTimeout(() => {
      if (!AppStore.data.search_input.q) {
        delete AppStore.data.search_input.listings
        AppStore.emitChange()
        return
      }
      delete AppStore.data.search_input.typing
      AppStore.emitChange()
      ListingDispatcher.dispatch({
        action: 'search-listing-input',
        q: AppStore.data.search_input.q
      })
    }, 500)
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
    const listing_map = data.listing_map
    const options = listing_map.options
    const status = options.listing_statuses.join(',')
    AppStore.emitChange()
    ListingDispatcher.dispatch({
      action: 'search-listing-map',
      user,
      q,
      status
    })
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