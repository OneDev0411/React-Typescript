// actions/notifications/get-all.js
import { browserHistory } from 'react-router'
import Notification from '../../models/Notification'
import AppStore from '../../stores/AppStore'
import _ from 'lodash'
export default (user) => {
  const params = {
    access_token: user.access_token
  }
  Notification.deleteAll(params, (err, response) => {
    delete AppStore.data.notifications
    AppStore.emitChange()
  })
}
