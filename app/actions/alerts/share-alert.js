// actions/listings/share-alert.js
import Room from '../../models/Room'
import Alert from '../../models/Alert'
import AppStore from '../../stores/AppStore'
import async from 'async'
import _ from 'lodash'
import getMessages from '../messages/get-messages'

export default (user, rooms, contacts, alert) => {
  AppStore.data.listing_map.saving_alert = true
  AppStore.emitChange()
  if (rooms && rooms.length) {
    async.eachSeries(rooms, (room, callback) => {
      alert.room = room
      const params = {
        access_token: user.access_token,
        alert
      }
      Alert.create(params, () => {
        const room_object = _.find(AppStore.data.rooms, { id: room })
        getMessages(user, room_object)
        callback()
      })
    }, () => {
      delete AppStore.data.listing_map.saving_alert
      delete AppStore.data.listing_map.show_share_modal
      delete AppStore.data.share_list
      AppStore.emitChange()
    })
  }
  if (contacts && contacts.length) {
    const data = {}
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
          AppStore.data.messages = [new_room.latest_message]
          getMessages(user, new_room)
          data.room_id = data.id
          callback()
        })
      },
      callback => {
        // Invite contacts
        const invitations = contacts.map(contact => {
          const invitation = {
            room: data.room_id
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
        alert.room = data.room_id
        const params = {
          access_token: user.access_token,
          alert
        }
        Alert.create(params, () => {
          callback()
        })
      }
    ], () => {
      delete AppStore.data.listing_map.saving_alert
      delete AppStore.data.listing_map.show_share_modal
      delete AppStore.data.share_list
      AppStore.emitChange()
    })
  }
}