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
      AppStore.data.listing_inquiry_success_id = listing
    else
      AppStore.data.show_listing_inquiry_error = true
    setTimeout(() => {
      window.top.location.href = 'https://' + AppStore.data.brand.subdomain + '.rechat.com/dashboard/recents'
      AppStore.emitChange()
    }, 1000)
  })
}