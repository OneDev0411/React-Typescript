// models/User.js
import es6Promise from 'es6-promise'
es6Promise.polyfill()
import 'isomorphic-fetch'
import superagent from 'superagent'
import config from '../../config/public'
import Fetch from '../services/fetch'

export default {
  get: (params, callback) => {
    const endpoint = `/api/users/get-user/${params.id}?access_token=${params.access_token}`
    fetch(endpoint, {
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
  getSelf: (params, callback) => {
    const endpoint = `/api/users/get-user/self?access_token=${params.access_token}`
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
  search: (params, callback) => {
    const endpoint = `/api/users/search?access_token=${params.access_token}&q=${params.q}`
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
  create: (params, callback) => {
    const endpoint = '/api/signup'
    const request_object = params.user
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
  async createShadow(params, callback) {
    const endpoint = '/api/signup-shadow'

    try {
      const response = await superagent.post(endpoint).send(params.user)
      return callback(false, response.body)
    } catch (e) {
      const error = {
        status: 'error',
        response: e.response
      }

      return callback(error, false)
    }
  },
  sendVerifyEmail: (params, callback) => {
    const endpoint = `/api/email-verifications?access_token=${params.access_token}`
    const access_token = params.access_token
    const request_object = {
      access_token
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
  sendVerifyPhone: (params, callback) => {
    const endpoint = `/api/phone-verifications?access_token=${params.access_token}`
    const access_token = params.access_token
    const request_object = {
      access_token
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
  signin: (params, callback) => {
    const endpoint = '/api/signin'
    const request_object = {
      email: params.email,
      password: params.password
    }
    if (params.invite)
      request_object.invite = params.invite
    fetch(endpoint, {
      method: 'post',
      credentials: 'include',
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
  signout: (params, callback) => {
    const endpoint = '/signout'
    fetch(endpoint)
    .then((response) => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response
    })
    .then(response => callback(false, response))
  },
  forgotPassword: (params, callback) => {
    const endpoint = '/api/forgot-password'
    const request_object = {
      email: params.email
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
  resetPassword: (params, callback) => {
    const endpoint = '/api/reset-password'
    const request_object = {
      token: params.token,
      password: params.password
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
  createPassword: (params, callback) => {
    const endpoint = '/api/create-password'
    const request_object = {
      phone_number: params.phone_number,
      email: params.email,
      token: params.token, // already decoded
      password: params.password,
      agent: params.agent
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
  verifyPhone: (params, callback) => {
    const endpoint = '/api/verify-phone'

    const request_object = {
      code: params.code,
      token: params.token
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
  edit: async (params, callback) => {
    try {
      const response = await new Fetch()
        .put('/users/self')
        .send(params.user)

      return callback(false, response.body)

    } catch (error) {
      return callback(error, false)
    }
    // const endpoint = `/api/edit-user?access_token=${params.access_token}`
    // const request_object = {
    //   user: params.user,
    //   access_token: params.access_token
    // }
    // fetch(endpoint, {
    //   method: 'post',
    //   credentials: 'include',
    //   headers: {
    //     'Content-type': 'application/json'
    //   },
    //   body: JSON.stringify(request_object)
    // })
    // .then((response) => {
    //   if (response.status >= 400) {
    //     const error = {
    //       status: 'error',
    //       body: response.body
    //     }
    //     return callback(error, false)
    //   }
    //   return response.json()
    // })
    // .then(response => callback(false, response))
  },
  uploadImage: async file => {
    try {
      const response = await new Fetch()
        .upload('/users/self/profile_image_url', 'patch')
        .attach('media', file)

      return response.body.data
    } catch (error) {
      throw error
    }
  },
  editProfilePic: (params, callback) => {
    const endpoint = `/api/edit-profile-pic?access_token=${params.access_token}`
    const request_object = {
      profile_image_url: params.profile_image_url,
      access_token: params.access_token
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
  editPassword: (params, callback) => {
    const endpoint = `/api/edit-password?access_token=${params.access_token}`
    const request_object = {
      old_password: params.old_password,
      new_password: params.new_password,
      access_token: params.access_token
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
  upgradeAccount: (params, callback) => {
    const endpoint = `/api/upgrade-account?access_token=${params.access_token}`
    const request_object = {
      agent: params.agent,
      secret: params.secret,
      access_token: params.access_token
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
  getFavorites: (params, callback) => {
    const endpoint = `/api/user/get-favorites?access_token=${params.access_token}`
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
  listingInquiry: (params, callback) => {
    const endpoint = `/api/user/listing-inquiry?access_token=${params.access_token}`
    const request_object = {
      access_token: params.access_token,
      agent: params.agent,
      listing: params.listing,
      brand: params.brand,
      source_type: params.source_type
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
