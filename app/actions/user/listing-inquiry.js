// actions/users/listing-inquiry.js
import User from '../../models/User'
import AppStore from '../../stores/AppStore'

export default (user, agent, listing) => {
  const params = {
    access_token: user.access_token,
    agent,
    listing,
    brand: AppStore.data.brand.id,
    source_type: 'BrokerageWidget'
  }
  User.listingInquiry(params, (err, res) => {
    // Success
    if (res.status === 'success')
      AppStore.data.show_listing_inquiry_success = true
    else
      AppStore.data.show_listing_inquiry_error = true
    AppStore.emitChange()
  })
}