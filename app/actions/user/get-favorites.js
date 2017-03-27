// actions/user/get-favorites.js
import User from '../../models/User'
import AppStore from '../../stores/AppStore'
export default (user) => {
  const params = {
    access_token: user.access_token
  }
  User.getFavorites(params, (err, res) => {
    const mls_numbers = res
    AppStore.data.user.favorite_listings = mls_numbers
    AppStore.emitChange()
  })
}