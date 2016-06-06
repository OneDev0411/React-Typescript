// controller/alert-viewer.js
import AppStore from '../../../../stores/AppStore'
import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'
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
    const data = AppStore.data
    const user = data.user
    // Do instant heart
    let favorite = true
    if (!AppStore.data.user.favorite_listings)
      AppStore.data.user.favorite_listings = []
    if (controller.isFavorited(listing.id)) {
      AppStore.data.user.favorite_listings = AppStore.data.user.favorite_listings.filter(listing_loop => {
        if (listing_loop.id !== listing.id)
          return listing
      })
      favorite = false
    } else
      AppStore.data.user.favorite_listings.push(listing)
    AppStore.emitChange()
    // Handle DB later
    ListingDispatcher.dispatch({
      action: 'edit-favorite',
      user,
      listing,
      favorite
    })
  }
}
export default controller