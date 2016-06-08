// actions/recs/get-actives.js
import Rec from '../../models/Rec'
import AppStore from '../../stores/AppStore'
import _ from 'lodash'
export default (user) => {
  const params = {
    access_token: user.access_token
  }
  Rec.getActives(params, (err, res) => {
    const actives = res.data
    const active_listings = _.pluck(actives, 'listing')
    AppStore.data.active_listings = active_listings
    AppStore.emitChange()
  })
}