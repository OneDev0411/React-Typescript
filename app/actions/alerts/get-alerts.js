// actions/listings/get-alerts.js
import Alert from '../../models/Alert'
import Room from '../../models/Room'
import AppStore from '../../stores/AppStore'
import async from 'async'
import _ from 'lodash'
export default (user) => {
  async.series([
    // Get alerts
    callback => {
      const params = {
        access_token: user.access_token
      }
      Alert.getAll(params, (err, res) => {
        const alerts = res.data
        AppStore.data.alerts = alerts
        AppStore.emitChange()
        callback()
      })
    },
    // Get alert actives
    callback => {
      const alerts = AppStore.data.alerts
      if (!alerts)
        return callback()
      async.eachSeries(alerts, (alert, callbackEach) => {
        const params = {
          access_token: user.access_token,
          room_id: alert.room
        }
        Room.getActives(params, (err, res) => {
          const actives = res.data
          const index = _.findIndex(alerts, { id: alert.id })
          AppStore.data.alerts[index].actives = actives
          callbackEach()
        })
      }, () => {
        AppStore.emitChange()
      })
    }
  ])
}