// actions/listings/share-alert.js
import Room from '../../models/Room'
import Alert from '../../models/Alert'
import AppStore from '../../stores/AppStore'
import async from 'async'
import getMessages from '../messages/get-messages'

export default (user, rooms, contacts, emails, phone_numbers, alert) => {
  AppStore.data.listing_map.saving_alert = true
  AppStore.emitChange()
  // Share w/ emails
  if (emails && emails.length) {
    const params = {
      access_token: user.access_token,
      alert,
      emails
    }
    Alert.create(params, (err, res) => {
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
    })
  }
  // Share w/ phone_numbers
  if (phone_numbers && phone_numbers.length) {
    const params = {
      access_token: user.access_token,
      alert,
      phone_numbers
    }
    Alert.create(params, (err, res) => {
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
    })
  }
  // Share w/ room
  if (rooms && rooms.length) {
    async.eachSeries(rooms, (room, callback) => {
      alert.room = room.id
      const params = {
        access_token: user.access_token,
        alert
      }
      Alert.createRoomAlert(params, (err, res) => {
        if (res.status === 'success') {
          const new_alert = res.data
          if (!AppStore.data.alerts)
            AppStore.data.alerts = []
          AppStore.data.alerts.unshift(new_alert)
        }
        if (room.id !== user.personal_room)
          getMessages(user, room)
        callback()
      })
    }, () => {
      delete AppStore.data.listing_map.saving_alert
      delete AppStore.data.listing_map.show_share_modal
      delete AppStore.data.listing_map.show_share_type_modal
      delete AppStore.data.share_list
      AppStore.data.show_alert_saved_modal = true
      AppStore.emitChange()
      setTimeout(() => {
        delete AppStore.data.show_alert_saved_modal
        AppStore.emitChange()
      }, 3000)
    })
  }
  // Share w/ contacts
  if (contacts && contacts.length) {
    const locals = {}
    async.series([
      callback => {
        // Create room
        const params = {
          title: alert.title,
          owner: user.id,
          access_token: user.access_token
        }
        Room.create(params, (err, response) => {
          const new_room = response.data
          AppStore.data.rooms.unshift(new_room)
          AppStore.data.current_room = new_room
          AppStore.data.current_room.messages = [new_room.latest_message]
          AppStore.emitChange()
          getMessages(user, new_room)
          locals.room_id = new_room.id
          callback()
        })
      },
      callback => {
        // Invite contacts
        const invitations = contacts.map(contact => {
          const invitation = {
            room: locals.room_id
          }
          if (contact.first_name)
            invitation.invitee_first_name = contact.first_name
          if (contact.last_name)
            invitation.invitee_last_name = contact.last_name
          if (contact.email)
            invitation.email = contact.email
          if (contact.phone_number)
            invitation.phone_number = contact.phone_number
          return invitation
        })
        const params = {
          access_token: user.access_token,
          invitations
        }
        Room.inviteContacts(params, () => {
          callback()
        })
      },
      callback => {
        // Create alert
        alert.room = locals.room_id
        const params = {
          access_token: user.access_token,
          alert
        }
        Alert.createRoomAlert(params, (err, res) => {
          if (res.status === 'succes') {
            const new_alert = res.data
            if (!AppStore.data.alerts)
              AppStore.data.alerts = []
            AppStore.data.alerts.unshift(new_alert)
          }
          AppStore.emitChange()
          callback()
        })
      }
    ], () => {
      delete AppStore.data.listing_map.saving_alert
      delete AppStore.data.listing_map.show_share_modal
      delete AppStore.data.share_list
      AppStore.data.show_alert_saved_modal = true
      AppStore.emitChange()
      setTimeout(() => {
        delete AppStore.data.show_alert_saved_modal
        AppStore.emitChange()
      }, 3000)
    })
  }
}