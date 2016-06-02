// controller/favorites-viewer.js
import AppStore from '../../../../stores/AppStore'
import _ from 'lodash'
const controller = {
  isFavorited(listing_id) {
    const data = AppStore.data
    const user = data.user
    if (user.favorite_listings && user.favorite_listings.length && _.find(user.favorite_listings, { id: listing_id }))
      return true
    return false
  },
  handleFavoriteAction(listing) {
    if (!AppStore.data.user.favorite_listings)
      AppStore.data.user.favorite_listings = []
    if (controller.isFavorited(listing.id))
      AppStore.data.user.favorite_listings = AppStore.data.user.favorite_listings.filter(listing_loop => {
        if (listing_loop.id !== listing.id)
          return listing
      })
    else
      AppStore.data.user.favorite_listings.push(listing)
    AppStore.emitChange()
  },
  hideFavoritesViewer() {
    delete AppStore.data.show_favorites_viewer
    AppStore.data.show_alerts_map = true
    AppStore.emitChange()
  }
}
export default controller