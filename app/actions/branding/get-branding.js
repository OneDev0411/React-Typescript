// actions/branding/get-branding.js
import Brand from '../../models/Brand'
import AppStore from '../../stores/AppStore'
import ListingDispatcher from '../../dispatcher/ListingDispatcher'
import config from '../../../config/public'
import URL from 'url'

const app_hostname = URL.parse(config.app.url).hostname

export default hostname => {
  if (app_hostname === hostname)
    return

  const params = {
    hostname,
    user: AppStore.data.user
  }

  Brand.getByHostname(params, (err, res) => {
    if (res && res.status === 'success') {
      AppStore.data.brand = res.data
      AppStore.data.brand_queried = true
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
