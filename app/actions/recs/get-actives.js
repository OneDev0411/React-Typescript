// TODO REMOVE DEPRECATED //
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
    recs.forEach((rec) => {
      active_listings.push({
        ...rec.listing,
        favorited_by: rec.favorited_by,
        commented_by: rec.commented_by,
        shared_by: rec.shared_by
      })
    })
    AppStore.data.active_listings = active_listings
    AppStore.emitChange()
  })
}