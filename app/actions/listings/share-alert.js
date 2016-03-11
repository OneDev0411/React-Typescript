// actions/listings/share-alert.js
// import Listing from '../../models/Listing'
import AppStore from '../../stores/AppStore'

export default (user, id) => {
  // Need docs
  // const params = {
  //   id,
  //   access_token: user.access_token
  // }
  delete AppStore.data.listing_map.show_share_modal
  delete AppStore.data.contacts_added
  AppStore.emitChange()
  console.log('share alert')
  // Listing.get(params, (err, response) => {
  //   // Success
  //   if (response.status === 'success') {
  //     AppStore.data.current_listing = response.data
  //     AppStore.data.show_listing_viewer = true
  //   }
  //   AppStore.emitChange()
  // })
}