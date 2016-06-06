// models/Room.js
import es6Promise from 'es6-promise'
es6Promise.polyfill()
import 'isomorphic-fetch'
import superagent from 'superagent'
import config from '../../config/public'

export default {
  create: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url

    const create_room_url = api_host + '/api/create-room'

    const request_object = {
      title: params.title,
      owner: params.owner,
      access_token: params.access_token
    }
    fetch(create_room_url, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(request_object)
    })
    .then(response => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => {
      return callback(false, response)
    })
  },
  delete: (params, callback) => {
    let api_host = params.api_host
    if (!api_host)
      api_host = config.app.url
    const url = `${api_host}/api/delete-room/?id=${params.id}&access_token=${params.access_token}`
    fetch(url, {
      method: 'get',
      headers: {
        'Content-type': 'application/json'
      }
    })
    .then(response => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => {
      return callback(false, response)
    })
  },
  getMessages: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url

    const get_messages_url = `${api_host}/api/messages/?room_id=${params.room_id}` +
      `&access_token=${params.access_token}` +
      `&limit=${params.limit}` +
      `&max_value=${params.max_value}`

    fetch(get_messages_url)
    .then(response => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => {
      return callback(false, response)
    })
  },
  getPrevious: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url

    const get_messages_url = `${api_host}/api/messages/?room_id=${params.room_id}` +
      `&access_token=${params.access_token}` +
      `&limit=${params.limit}` +
      `&max_value=${params.max_value}`

    fetch(get_messages_url)
    .then(response => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => {
      return callback(false, response)
    })
  },
  addUser: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url

    const add_user_to_room_url = api_host + '/api/add-user-to-room'

    const request_object = {
      room_id: params.room_id,
      user: params.user,
      access_token: params.access_token
    }

    fetch(add_user_to_room_url, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(request_object)
    })
    .then(response => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => {
      return callback(false, response)
    })
  },
  inviteContacts: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const endpoint = api_host + '/api/invite-contacts'
    const request_object = {
      invitations: params.invitations,
      access_token: params.access_token
    }
    fetch(endpoint, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(request_object)
    })
    .then(response => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => {
      return callback(false, response)
    })
  },
  uploadFiles: (params, callback) => {
    const api_url = config.api_url
    const endpoint = api_url + '/attachments'
    const request = superagent.post(endpoint)
    const files = params.files
    request.set('authorization', 'Bearer ' + params.access_token)
    files.forEach(file => {
      const info = {
        name: file.name,
        original_name: file.name,
        title: file.name
      }
      request.attach('media', file)
      request.field('info', JSON.stringify(info))
    })
    return callback(request)
  },
  setNotifications: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const id = params.id
    const notification = params.notification
    const endpoint = api_host + '/api/notifications'
    const request_object = {
      id,
      notification,
      access_token: params.access_token
    }
    fetch(endpoint, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(request_object)
    })
    .then(response => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => {
      return callback(false, response)
    })
  },
  acknowledgeNotifications: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const room = params.room
    const endpoint = api_host + '/api/acknowledge-room-notifications'
    const request_object = {
      room,
      access_token: params.access_token
    }
    fetch(endpoint, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(request_object)
    })
    .then(response => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => {
      return callback(false, response)
    })
  },
  createRec: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const endpoint = api_host + '/api/create-rec'
    const rooms = params.rooms
    const users = params.users
    const emails = params.emails
    const phone_numbers = params.phone_numbers
    const mls_number = params.mls_number
    const request_object = {
      access_token: params.access_token,
      rooms,
      users,
      emails,
      phone_numbers,
      mls_number,
      notification: params.notification,
      message: params.message
    }
    fetch(endpoint, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(request_object)
    })
    .then(response => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => {
      return callback(false, response)
    })
  },
  getActives: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const room_id = params.room_id
    const endpoint = api_host + '/api/get-actives?room_id=' + room_id + '&access_token=' + params.access_token
    fetch(endpoint)
    .then(response => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => {
      return callback(false, response)
    })
  }
}