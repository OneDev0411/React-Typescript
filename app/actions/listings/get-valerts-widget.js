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
  console.log('widget')
  Listing.getValerts(params, (err, response) => {
    // Success
    if (response.status === 'success') {
      if (!AppStore.data.widget)
        AppStore.data.widget = {}
      if (AppStore.data.location.query.all)
        AppStore.data.widget.listings = response.data
      else
        AppStore.data.widget.listings = _.slice(response.data, 0, 10)
      AppStore.data.widget.listings_info = response.info
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
    delete AppStore.data.widget.is_loading_listings
    AppStore.emitChange()
  })
}