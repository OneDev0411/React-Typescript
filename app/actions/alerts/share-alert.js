// actions/listings/share-alert.js
import AppStore from '../../stores/AppStore'
import Room from '../../models/Room'
import _ from 'lodash'
import async from 'async'
import AppDispatcher from '../../dispatcher/AppDispatcher'
export default (user, rooms, users, emails, phone_numbers, alert, message) => {
  // TODO remove hack fix
  if (alert.mls_areas === 'null')
    alert.mls_areas = null
  AppStore.data.listing_map.saving_alert = true
  AppStore.emitChange()
  // Get a room
  const available_rooms = AppStore.data.rooms
  let room_found = null
  if (users.length && !emails.length && !phone_numbers.length) {
    available_rooms.forEach((room) => {
      let user_ids_room = _.map(room.users, 'id')
      user_ids_room = user_ids_room.filter(user_id => user_id !== AppStore.data.user.id)
      if (_.isEqual(users.sort(), user_ids_room.sort()))
        room_found = room
    })
  }
  if (room_found) {
    const room_id = room_found.id
    const params = {
      access_token: user.access_token,
      alert,
      room_id
    }
    Room.createAlert(params, (err, res) => {
      delete AppStore.data.listing_map.saving_alert
      delete AppStore.data.listing_map.show_share_modal
      delete AppStore.data.share_list
      AppStore.data.show_alert_saved_modal = true
      if (res.status === 'success') {
        const new_alert = res.data
        if (!AppStore.data.alerts)
          AppStore.data.alerts = []
        AppStore.data.alerts.unshift(new_alert)
      }
      AppStore.emitChange()
      setTimeout(() => {
        delete AppStore.data.show_alert_saved_modal
        AppStore.emitChange()
      }, 3000)
      if (message) {
        AppDispatcher.dispatch({
          action: 'create-message',
          user,
          room: room_found,
          comment: message
        })
      }
    })
    return
  }
  // Room not found, create room
  const locals = {}

  const brand = AppStore.data.brand ? AppStore.data.brand.id : null

  async.series([
    (callback) => {
      // Create room
      const params = {
        title: '',
        owner: user.id,
        access_token: user.access_token,
        users,
        emails,
        phone_numbers,
        brand
      }
      Room.create(params, (err, response) => {
        // Success
        if (response.status === 'success') {
          const new_room = response.data
          AppStore.data.status = 'success'
          AppStore.data.show_message = true
          AppStore.data.show_create_chat_modal = false
          if (!AppStore.data.rooms)
            AppStore.data.rooms = []
          AppStore.data.rooms.unshift(new_room)
          AppStore.data.current_room = new_room
          locals.current_room = new_room
          AppStore.data.current_room.messages = [new_room.latest_message]
        } else {
          AppStore.data.status = 'error'
          AppStore.data.submitting = false
          AppStore.data.show_message = true
          AppStore.data.request_error = true
        }
        delete AppStore.data.loading
        callback()
      })
    },
    () => {
      const params = {
        access_token: user.access_token,
        alert,
        room_id: locals.current_room.id
      }
      Room.createAlert(params, (err, res) => {
        delete AppStore.data.listing_map.saving_alert
        delete AppStore.data.listing_map.show_share_modal
        delete AppStore.data.share_list
        AppStore.data.show_alert_saved_modal = true
        if (res.status === 'success') {
          const new_alert = res.data
          if (!AppStore.data.alerts)
            AppStore.data.alerts = []
          AppStore.data.alerts.unshift(new_alert)
        }
        AppStore.emitChange()
        setTimeout(() => {
          delete AppStore.data.show_alert_saved_modal
          AppStore.emitChange()
        }, 3000)
        if (message) {
          AppDispatcher.dispatch({
            action: 'create-message',
            user,
            room: locals.current_room,
            comment: message
          })
        }
      })
    }
  ])
}