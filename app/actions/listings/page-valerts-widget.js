// actions/listings/get-valerts-widget.js
import Listing from '../../models/Listing'
import AppStore from '../../stores/AppStore'
import _ from 'lodash'
export default (user, options) => {
  const params = {
    options
  }
  if (user) {
    params.access_token = user.access_token
  }
  if (AppStore.data.brand) {
    params.office = AppStore.data.brand.office_mls_id
  }
  // Set the offset
  params.offset = AppStore.data.widget[options.type].listings.length
  Listing.getValerts(params, (err, response) => {
    // Success
    if (response.status === 'success') {
      if (!AppStore.data.widget) {
        AppStore.data.widget = {}
      }
      if (!AppStore.data.widget[response.options.type]) {
        AppStore.data.widget[response.options.type] = {}
      }
      AppStore.data.widget[response.options.type].options = response.options
      const total = response.info.total
      AppStore.data.widget[response.options.type].listings = [
        ...response.data,
        ...AppStore.data.widget[response.options.type].listings
      ]
      AppStore.data.widget[response.options.type].listings = _.uniq(AppStore.data.widget[response.options.type].listings, 'id')
      AppStore.data.widget[response.options.type].listings_info = response.info
      if (total === AppStore.data.widget[response.options.type].listings.length) {
        AppStore.data.widget[response.options.type].loaded_all = true
      }
    }
    if ((response.options ? response.options.listing_statuses[0] : options.listing_statuses[0]) === 'Sold') {
      AppStore.data.widget[response.options.type].listings.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
      AppStore.data.widget[response.options.type].listings.reverse()
    } else {
      AppStore.data.widget[response.options.type].listings = _.shuffle(AppStore.data.widget[response.options.type].listings)
    }
      // Order actives by price
    if (AppStore.data.location.query.order_by && AppStore.data.location.query.order_by === 'price') {
      AppStore.data.widget[response.options.type].listings.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
      AppStore.data.widget[response.options.type].listings.reverse()
    }
    delete AppStore.data.widget.is_loading
    delete AppStore.data.widget[response.options.type].is_loading_listings
    AppStore.emitChange()
  })
}