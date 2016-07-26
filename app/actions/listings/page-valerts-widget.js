// actions/listings/get-valerts-widget.js
import Listing from '../../models/Listing'
import AppStore from '../../stores/AppStore'
import _ from 'lodash'
export default (user, options) => {
  const params = {
    options
  }
  if (user)
    params.access_token = user.access_token
  if (AppStore.data.brand)
    params.office = AppStore.data.brand.office_mls_id
  // Set the offset
  if (AppStore.data.widget.listings.length === 75)
    params.offset = 75
  else
    params.offset = AppStore.data.widget.listings.length + 75
  Listing.getValerts(params, (err, response) => {
    // Success
    if (response.status === 'success') {
      if (!AppStore.data.widget)
        AppStore.data.widget = {}
      const total = response.info.total
      AppStore.data.widget.listings = [
        ...response.data,
        ...AppStore.data.widget.listings
      ]
      AppStore.data.widget.listings = _.uniq(AppStore.data.widget.listings, 'id')
      AppStore.data.widget.listings_info = response.info
      if (total === AppStore.data.widget.listings.length)
        AppStore.data.widget.loaded_all = true
    }
    if (options.listing_statuses[0] === 'Sold') {
      AppStore.data.widget.listings.sort((a, b) => {
        return parseFloat(a.price) - parseFloat(b.price)
      })
      AppStore.data.widget.listings.reverse()
    } else
      AppStore.data.widget.listings = _.shuffle(AppStore.data.widget.listings)
    // Order actives by price
    if (AppStore.data.location.query.order_by && AppStore.data.location.query.order_by === 'price') {
      AppStore.data.widget.listings.sort((a, b) => {
        return parseFloat(a.price) - parseFloat(b.price)
      })
      AppStore.data.widget.listings.reverse()
    }
    delete AppStore.data.widget.is_loading
    AppStore.emitChange()
  })
}