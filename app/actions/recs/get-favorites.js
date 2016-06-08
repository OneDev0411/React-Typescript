// actions/recs/get-favorites.js
import Rec from '../../models/Rec'
import AppStore from '../../stores/AppStore'
import _ from 'lodash'
export default (user) => {
  const params = {
    room_id: user.personal_room,
    access_token: user.access_token
  }
  Rec.getFavorites(params, (err, res) => {
    const recs = res.data
    const favorite_listings = _.pluck(recs, 'listing')
    AppStore.data.user.favorite_listings = favorite_listings
    AppStore.emitChange()
  })
}