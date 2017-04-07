// actions/recs/get-favorites.js
import Rec from '../../models/Rec'
import AppStore from '../../stores/AppStore'
export default (user) => {
  const params = {
    room_id: user.personal_room,
    access_token: user.access_token
  }
  Rec.getFavorites(params, (err, res) => {
    const recs = res.data
    const favorite_listings = []
    recs.forEach((rec) => {
      favorite_listings.push({
        ...rec.listing,
        favorited_by: rec.favorited_by,
        commented_by: rec.commented_by,
        shared_by: rec.shared_by
      })
    })
    AppStore.data.favorite_listings = favorite_listings
    AppStore.data.user.favorite_listings = _.map(favorite_listings, 'mls_number')
    AppStore.emitChange()
  })
}