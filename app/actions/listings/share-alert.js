// actions/listings/share-alert.js
// import Alert from '../../models/Alert'
import AppStore from '../../stores/AppStore'
// Add async

export default (user, rooms, contacts, alert) => {
  // Next steps:
  // 1. loop to add alerts for each room
  // 2. add contacts to new room and add alert to room
  // const params = {
  //   id,
  //   access_token: user.access_token
  //   rooms,
  //   contacts,
  //   alert
  // }
  delete AppStore.data.listing_map.show_share_modal
  delete AppStore.data.contacts_added
  AppStore.emitChange()
  // console.log('share alert')
  // Alert.create(params, (err, response) => {
  //   // Success
  //   if (response.status === 'success') {
  //     AppStore.data.current_listing = response.data
  //     AppStore.data.show_listing_viewer = true
  //   }
  //   AppStore.emitChange()
  // })
}