// actions/recs/get-actives.js
import Rec from '../../models/Rec'
import AppStore from '../../stores/AppStore'
export default (user) => {
  const params = {
    access_token: user.access_token
  }
  Rec.getActives(params, (err, res) => {
    const recs = res.data
    const active_listings = []
    recs.forEach(active_listing => {
      active_listings.push({
        ...active_listing.listing,
        favorited_by: active_listing.favorited_by,
        commented_by: active_listing.commented_by,
        shared_by: active_listing.shared_by
      })
    })
    AppStore.data.active_listings = active_listings
    AppStore.emitChange()
  })
}