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

const asyncRequest = async request => {
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
  fetch: async (id, brand, access_token) => {
    const endpoint = `/listings/${id}?associations=compact_listing.proposed_agent`

    const fetchListing = new Fetch().get(endpoint)

    // required on ssr
    if (access_token) {
      fetchListing.set({ Authorization: `Bearer ${access_token}` })
    }

    if (brand) {
      fetchListing.set('X-RECHAT-BRAND', brand.id)
    }

    return await fetchListing
  },
  get: (params, callback) => {
    new Fetch()
      .get(`/listings/${params.id}?associations=compact_listing.proposed_agent`)
      .end((err, res) => {
        if (err) {
          return callback(err, false)
        }

        res.status = 'success'
        res.data = res.body.data
        res.info = res.body.info

        return callback(false, res)
      })
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
    const {
      options, office, offset, brand
    } = params

    // base endpoint
    let endpoint = '/valerts'

    // From map widget
    if (office && !options.list_offices) {
      endpoint +=
        `?associations=compact_listing.proposed_agent&order_by[]=office&order_by[]=status&office=${
          office}`
    }

    // From listing widget
    if ((options.list_offices && options.list_offices.length) || options.brand) {
      endpoint += '?associations=compact_listing.proposed_agent'

      if (options.listing_statuses[0] === 'Sold') {
        endpoint += '&order_by[]=price'
      }
    }

    // Offset
    if (offset) {
      endpoint = `${endpoint}&limit=500&offset=${offset}`
    }

    new Fetch()
      .post(endpoint)
      .send(options)
      .end((err, res) => {
        if (err) {
          return callback(err, false)
        }

        res.status = 'success'
        res.data = res.body.data
        res.info = res.body.info

        return callback(false, res)
      })

    // const endpoint = `/api/listings/valerts?access_token=${params.access_token}`
    // const request_object = {
    //   options: params.options
    // }

    // if (params.office) {
    //   request_object.office = params.office
    // }

    // if (params.offset) {
    //   request_object.offset = params.offset
    // }

    // if (params.brand) {
    //   request_object.brand = params.brand
    // }

    // fetch(endpoint, {
    //   method: 'post',
    //   headers: {
    //     'Content-type': 'application/json'
    //   },
    //   body: JSON.stringify(request_object)
    // })
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
    //   .then(response => callback(false, { ...response, ...params }))
  },
  getListing: async id => {
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
