// controller/listing-panel.js
import listing_util from '../../../../utils/listing'
import _ from 'lodash'
import AppStore from '../../../../stores/AppStore'
const controller = {
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
  hideListingPanel() {
    delete AppStore.data.show_listing_panel
    delete AppStore.data.listing_panel
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
  }
}
export default controller