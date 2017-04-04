// actions/recs/mark-as-read.js
import Rec from '../../models/Rec'
import AppStore from '../../stores/AppStore'
export default (user, alert_id, room_id) => {
  const params = {
    access_token: user.access_token,
    alert_id,
    room_id
  }
  Rec.mark(params, (err, res) => {
    delete AppStore.data.current_alert.new_recommendations
    AppStore.emitChange()
  })
}