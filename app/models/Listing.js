// models/Listing.js
import es6Promise from 'es6-promise'
es6Promise.polyfill()
import 'isomorphic-fetch'
import Fetch from '../services/fetch'
import config from '../../config/public'

const API_HOST = config.api_url

const getRequest = (url, token) =>
  new Request(url, {
    method: 'GET',
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    })
  })

const asyncRequest = async (request) => {
  try {
    const response = await fetch(request)
    if (response.status >= 200 && response.status < 300) {
      const parsedResponse = await response.json()
      return parsedResponse.data
    }
  } catch (error) {
    throw error
  }
}

export default {
  fetch: async (id, access_token) => {
    const endpoint = `/listings/${id}`
    const fetchListing = new Fetch().get(endpoint)

    // required on ssr
    if (access_token)
      fetchListing.set({ Authorization: `Bearer ${access_token}` })

    return await fetchListing
  },
  get: (params, callback) => {
    const endpoint = `/api/listings/${params.id}?access_token=${params.access_token}`
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
  getMlsNumber: (params, callback) => {
    const { access_token, q } = params
    const url = `${API_HOST}/listings/search?mls_number=${q}`
    callback(false, asyncRequest(getRequest(url, access_token)))
  },
  search: (params, callback) => {
    const { access_token, q } = params
    const url = `${API_HOST}/listings/search?q=${q}`
    callback(false, asyncRequest(getRequest(url, access_token)))
  },
  getValerts: (params, callback) => {
    const endpoint = `/api/listings/valerts?access_token=${params.access_token}`
    const request_object = {
      options: params.options
    }

    if (params.office) {
      request_object.office = params.office
    }

    if (params.offset) {
      request_object.offset = params.offset
    }

    if (params.brand) {
      request_object.brand = params.brand
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
  getListing: async (id) => {
    if (!id) {
      return
    }

    try {
      const response = await new Fetch().get(`/listings/${id}`)

      return response.body.data
    } catch (error) {
      throw error
    }
  }
}
