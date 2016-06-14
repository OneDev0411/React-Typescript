// controller/alert-viewer.js
import AppStore from '../../../../stores/AppStore'
import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'
import _ from 'lodash'
const controller = {
  markAsRead(recs) {
    const data = AppStore.data
    const user = data.user
    if (!recs || !recs.length)
      return
    const recommendations = recs.map(rec => {
      return {
        recommendation: rec.id,
        action: 'read'
      }
    })
    ListingDispatcher.dispatch({
      action: 'mark-recs-as-read',
      user,
      recommendations
    })
  },
  isFavorited(mls_number) {
    const data = AppStore.data
    const user = data.user
    if (user.favorite_listings && user.favorite_listings.length && user.favorite_listings.indexOf(mls_number) !== -1)
      return true
    return false
  },
  handleFavoriteAction(listing) {
    const data = AppStore.data
    const user = data.user
    const mls_number = listing.mls_number
    // Do instant heart
    let favorite = true
    if (!AppStore.data.user.favorite_listings)
      AppStore.data.user.favorite_listings = []
    if (controller.isFavorited(mls_number)) {
      AppStore.data.user.favorite_listings = AppStore.data.user.favorite_listings.filter(mls_number_loop => {
        if (mls_number_loop !== mls_number)
          return mls_number_loop
      })
      // Edit actives
      AppStore.data.active_listings = AppStore.data.active_listings.filter(listing_loop => {
        if (listing_loop.id !== listing.id)
          return listing_loop
      })
      favorite = false
    } else {
      AppStore.data.user.favorite_listings.push(mls_number)
      // Edit actives
      if (!AppStore.data.active_listings)
        AppStore.data.active_listings = []
      if (!_.find(AppStore.data.active_listings, { id: listing.id }))
        AppStore.data.active_listings.push(listing)
    }
    AppStore.emitChange()
    // Handle DB later
    ListingDispatcher.dispatch({
      action: 'edit-favorite',
      user,
      mls_number,
      favorite
    })
  }
}
export default controller