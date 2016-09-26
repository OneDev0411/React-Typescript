// actions/search-share.js
import User from '../../models/User'
import AppStore from '../../stores/AppStore'

export default (user, q) => {
  const params = {
    access_token: user.access_token,
    q
  }
  User.search(params, (err, res) => {
    // Success
    if (res.status === 'success') {
      AppStore.data.share_modal.users_found = res.data
      AppStore.emitChange()
    }
    AppStore.emitChange()
  })
}