// controller/alert-viewer.js
import AppStore from '../../../../stores/AppStore'
import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'
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
  handleMoreResultsClick() {
    const data = AppStore.data
    const user = data.user
    const current_alert = data.current_alert
    const feed = current_alert.feed
    if (!feed || feed.length === 0)
      return
    AppStore.data.current_alert.loading_more_feed_results = true
    AppStore.emitChange()
    ListingDispatcher.dispatch({
      action: 'get-paged-recs',
      user,
      alert: current_alert,
      timestamp: feed[feed.length - 1].created_at
    })
  }
}
export default controller