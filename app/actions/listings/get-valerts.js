// actions/listings/get-valerts.js
import Listing from '../../models/Listing'
import AppStore from '../../stores/AppStore'
import { getParameterByName } from '../../utils/helpers'
export default (user, options) => {
  const params = {
    options
  }
  if (user)
    params.access_token = user.access_token
  if (AppStore.data.brand) {
    let brokerage = getParameterByName('brokerage')
    if (!brokerage && AppStore.data.brand.offices)
      brokerage = AppStore.data.brand.offices[0].mls_office_id
    params.office = brokerage
  }
  Listing.getValerts(params, (err, response) => {
    // Success
    if (response.status === 'success') {
      AppStore.data.listing_map.listings = response.data
      AppStore.data.listing_map.listings_info = response.info
    }
    delete AppStore.data.listing_map.is_loading
    AppStore.emitChange()
  })
}