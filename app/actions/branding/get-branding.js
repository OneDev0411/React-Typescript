// actions/branding/get-branding.js
import Brand from '../../models/Brand'
import AppStore from '../../stores/AppStore'
import ListingDispatcher from '../../dispatcher/ListingDispatcher'
export default (hostname, user) => {
  const params = {
    hostname,
    access_token: user ? user.access_token : undefined
  }
  Brand.getByHostname(params, (err, res) => {
    if (res.status === 'success') {
      AppStore.data.brand = res.data
      if (AppStore.data.listing_map) {
        setTimeout(() => {
          ListingDispatcher.dispatch({
            action: 'get-valerts',
            user: AppStore.data.user,
            options: AppStore.data.listing_map.options
          })
        }, 500)
      }
      AppStore.emitChange()
    }
  })
}