// controller/listing-share.js
import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'
import AppStore from '../../../../stores/AppStore'
import _ from 'lodash'
const controller = {
  shareListing() {
    const data = AppStore.data
    const user = data.user
    const current_listing = AppStore.data.current_listing
    const share_modal = AppStore.data.share_modal
    const user_ids = _.map(share_modal.items_selected, 'value.contact_user.id')
    const message = this.refs.message.refs.input.value.trim()
    AppStore.data.share_modal.sending_share = true
    AppStore.emitChange()
    ListingDispatcher.dispatch({
      action: 'share-listing',
      user,
      mls_number: current_listing.mls_number,
      message,
      users: user_ids,
      notification: true
    })
  }
}
export default controller