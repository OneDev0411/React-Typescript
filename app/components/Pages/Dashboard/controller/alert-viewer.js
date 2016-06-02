// controller/alert-viewer.js
import AppStore from '../../../../stores/AppStore'
import _ from 'lodash'
const controller = {
  isFavorited(listing_id) {
    const data = AppStore.data
    const user = data.user
    if (user.favorite_listings && user.favorite_listings.length && user.favorite_listings.indexOf(listing_id) !== -1)
      return true
    return false
  },
  handleFavoriteAction(listing_id) {
    if (!AppStore.data.user.favorite_listings)
      AppStore.data.user.favorite_listings = []
    if (controller.isFavorited(listing_id))
      AppStore.data.user.favorite_listings = _.pull(AppStore.data.user.favorite_listings, listing_id)
    else
      AppStore.data.user.favorite_listings.push(listing_id)
    AppStore.emitChange()
  }
}
export default controller