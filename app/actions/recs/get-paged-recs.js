// actions/recs/get-paged-recs.js
import Alert from '../../models/Alert'
import AppStore from '../../stores/AppStore'
import ListingDispatcher from '../../dispatcher/ListingDispatcher'
export default (user, alert, timestamp) => {
  const params = {
    access_token: user.access_token,
    alert_id: alert.id,
    room_id: alert.room,
    timestamp
  }
  Alert.getPaged(params, (err, res) => {
    const more_recs = res.data
    if (!more_recs || !more_recs.length)
      return
    if (!AppStore.data.current_alert.feed)
      AppStore.data.current_alert.feed = []
    const feed = AppStore.data.current_alert.feed
    AppStore.data.current_alert.feed = [
      ...feed,
      ...more_recs
    ]
    delete AppStore.data.current_alert.loading_more_feed_results
    AppStore.emitChange()
    // Mark as read
    if (!feed || !feed.length)
      return
    const recommendations = feed.map(rec => {
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
  })
}