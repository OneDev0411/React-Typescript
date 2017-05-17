// actions/chat-module/send-message.js
import User from '../../models/User'
import Room from '../../models/Room'
import AppStore from '../../stores/AppStore'
import AppDispatcher from '../../dispatcher/AppDispatcher'
import { randomString } from '../../utils/helpers'
import async from 'async'
import _ from 'lodash'
export default (user, agent, message) => {
  if (user) {
    // Check for room exists between user and agent
    const rooms = AppStore.data.rooms
    rooms.forEach((room) => {
      const users = room.users
      // search for 1:1
      let room_found
      if (users.length === 2) {
        const user_ids = _.map(users, 'id')
        if (user_ids.indexOf(user.id) !== -1 && user_ids.indexOf(agent.id) !== -1)
          room_found = room
      }
      if (room_found) {
        AppDispatcher.dispatch({
          action: 'create-message',
          user,
          room: room_found,
          comment: message
        })
      } else {
        const locals = {}

        const brand = AppStore.data.brand ? AppStore.data.brand.id : null

        async.series([
          (callback) => {
            const params = {
              title: '',
              owner: user.id,
              access_token: user.access_token,
              users: [user.id, agent.id],
              brand
            }
            Room.create(params, (err, res) => {
              const new_room = res.data
              if (!AppStore.data.rooms)
                AppStore.data.rooms = []
              AppStore.data.rooms.unshift(new_room)
              AppStore.data.current_room = new_room
              locals.current_room = new_room
              callback()
            })
          },
          () => {
            AppDispatcher.dispatch({
              action: 'create-message',
              user,
              room: locals.current_room,
              comment: message
            })
          }
        ])
      }
    })
    return
  }
  // if !user
  const email = `guest+${(new Date()).getTime()}@rechat.com`
  const random_password = randomString(9)
  const locals = {}
  async.series([
    (callback) => {
      const new_user = {
        first_name: email,
        email,
        user_type: 'Client',
        password: random_password,
        grant_type: 'password',
        is_shadow: true
      }
      const params = {
        user: new_user
      }
      User.createShadow(params, () => {
        callback()
      })
    },
    (callback) => {
      const params = {
        email,
        password: random_password
      }
      User.signin(params, (err, res) => {
        locals.user = res.data
        callback()
      })
    },
    (callback) => {
      const brand = AppStore.data.brand ? AppStore.data.brand.id : null

      const params = {
        title: '',
        owner: locals.user.id,
        access_token: locals.user.access_token,
        users: [locals.user.id, agent.id],
        brand
      }
      Room.create(params, (err, res) => {
        const new_room = res.data
        AppStore.data.rooms = [new_room]
        AppStore.data.current_room = new_room
        locals.current_room = new_room
        callback()
      })
    },
    () => {
      window.socket.emit('Authenticate', locals.user.access_token)
      AppDispatcher.dispatch({
        action: 'create-message',
        user: locals.user,
        room: locals.current_room,
        comment: message
      })
      AppStore.data.user = locals.user
      AppStore.emitChange()
    }
  ])
}