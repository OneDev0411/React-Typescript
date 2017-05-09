// actions/branding/get-branding.js
import Brand from '../../models/Brand'
import AppStore from '../../stores/AppStore'
import ListingDispatcher from '../../dispatcher/ListingDispatcher'
export default (hostname) => {
  // if (hostname === 'rechat.com' || hostname === 'localhost')
  //   return
  const params = {
    hostname: 'app.claystapp.com',
    user: AppStore.data.user
  }
  Brand.getByHostname(params, (err, res) => {
    if (res && res.status === 'success') {
      AppStore.data.brand = res.data
      // Auto move for the map when user loads map from search query
      if (AppStore.data.listing_map && !AppStore.data.listing_map.auto_move) {
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