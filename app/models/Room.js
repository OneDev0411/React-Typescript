// models/Room.js
import es6Promise from 'es6-promise'
es6Promise.polyfill()
import 'isomorphic-fetch'
import superagent from 'superagent'
import config from '../../config/public'

export default {
  create: (params, callback) => {

    const create_room_url = `/api/create-room?access_token=${params.access_token}`

    const request_object = {
      title: params.title,
      owner: params.owner,
      users: params.users,
      emails: params.emails,
      phone_numbers: params.phone_numbers,
      brand: params.brand
    }
    fetch(create_room_url, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(request_object)
    })
    .then((response) => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => callback(false, response))
  },
  createAlert: (params, callback) => {
    const endpoint = `/api/rooms/create-alert?access_token=${params.access_token}`
    const request_object = {
      alert: params.alert,
      room_id: params.room_id,
      message: params.message
    }
    fetch(endpoint, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(request_object)
    })
    .then((response) => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => callback(false, response))
  },
  delete: (params, callback) => {
    const url = `/api/delete-room/?id=${params.id}&access_token=${params.access_token}`
    fetch(url, {
      method: 'get',
      headers: {
        'Content-type': 'application/json'
      }
    })
    .then((response) => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => callback(false, response))
  },
  // getMessages: (params, callback) => {
  //   let api_host = params.api_host
  //   if (!api_host) api_host = config.app.url

  //   const get_messages_url = `/api/messages/?room_id=${params.room_id}` +
  //     `&access_token=${params.access_token}` +
  //     `&limit=${params.limit}` +
  //     `&max_value=${params.max_value}`

  //   fetch(get_messages_url)
  //   .then((response) => {
  //     if (response.status >= 400) {
  //       const error = {
  //         status: 'error',
  //         response
  //       }
  //       return callback(error, false)
  //     }
  //     return response.json()
  //   })
  //   .then(response => callback(false, response))
  // },
  // getPrevious: (params, callback) => {
  //   let api_host = params.api_host
  //   if (!api_host) api_host = config.app.url

  //   const get_messages_url = `/api/messages/?room_id=${params.room_id}` +
  //     `&access_token=${params.access_token}` +
  //     `&limit=${params.limit}` +
  //     `&max_value=${params.max_value}`

  //   fetch(get_messages_url)
  //   .then((response) => {
  //     if (response.status >= 400) {
  //       const error = {
  //         status: 'error',
  //         response
  //       }
  //       return callback(error, false)
  //     }
  //     return response.json()
  //   })
  //   .then(response => callback(false, response))
  // },
  addUser: (params, callback) => {

    const add_user_to_room_url = `/api/add-user-to-room?access_token=${params.access_token}`

    const request_object = {
      room_id: params.room_id,
      user: params.user,
      brand: params.brand
    }

    fetch(add_user_to_room_url, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(request_object)
    })
    .then((response) => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => callback(false, response))
  },
  addUsers: (params, callback) => {

    const endpoint = `/api/rooms/add-users?access_token=${params.access_token}`

    const request_object = {
      room_id: params.room_id,
      users: params.users,
      emails: params.emails,
      phone_numbers: params.phone_numbers,
      brand: params.brand
    }
    fetch(endpoint, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(request_object)
    })
    .then((response) => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => callback(false, response))
  },
  removeUser: (params, callback) => {
    const url = `/api/remove-user-from-room?user=${params.user}&room_id=${params.room}&access_token=${params.access_token}`

    fetch(url, {
      method: 'get',
      headers: {
        'Content-type': 'application/json'
      }
    })
    .then((response) => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => callback(false, response))
  },
  uploadFiles: (params, callback) => {
    const api_url = config.api_url
    const endpoint = `${api_url}/attachments`
    const request = superagent.post(endpoint)
    const files = params.files
    request.set('authorization', `Bearer ${params.access_token}`)
    files.forEach((file) => {
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
    const id = params.id
    const notification = params.notification
    const endpoint = `/api/notifications?access_token=${params.access_token}`
    const request_object = {
      id,
      notification
    }
    fetch(endpoint, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(request_object)
    })
    .then((response) => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => callback(false, response))
  },
  acknowledgeNotifications: (params, callback) => {
    const room = params.room
    const endpoint = `/api/acknowledge-room-notifications?access_token=${params.access_token}`
    const request_object = {
      room
    }
    fetch(endpoint, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(request_object)
    })
    .then((response) => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => callback(false, response))
  },
  createRec: (params, callback) => {
    const endpoint = `/api/create-rec?access_token=${params.access_token}`
    const room = params.room
    const mls_number = params.mls_number
    const request_object = {
      room,
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
    .then((response) => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => callback(false, response))
  },
  getActives: (params, callback) => {
    const room_id = params.room_id
    const endpoint = `/api/get-actives?room_id=${room_id}&access_token=${params.access_token}`
    fetch(endpoint)
    .then((response) => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => callback(false, response))
  },
  editFavorite: (params, callback) => {
    const room_id = params.room_id
    const rec_id = params.rec_id
    const favorite = params.favorite
    const endpoint = `/api/edit-favorite?access_token=${params.access_token}`
    const request_object = {
      room_id,
      rec_id,
      favorite
    }
    fetch(endpoint, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(request_object)
    })
    .then((response) => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => callback(false, response))
  }
}
