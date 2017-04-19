import 'whatwg-fetch'
import config from '../../config/public'

// set api host
const API_HOST = config.api_url
const PROXY_HOST = config.app.url

const getRequest = (url, token) => new Request(url, {
  method: 'GET',
  headers: new Headers({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  })
})
const postRequest = (url, body) => new Request(url, {
  method: 'POST',
  headers: new Headers({
    'Content-Type': 'application/json'
  }),
  body: JSON.stringify(body)
})

const asyncRequest = async (request) => {
  try {
    const response = await fetch(request)
    if (response.status >= 200 && response.status < 300) {
      const parsedResponse = await response.json()
      return parsedResponse.data
    }
  } catch (error) {
    console.log(`getBrandDeals: ${error}`)
    throw error
  }
}

export const getDeals = (params) => {
  const { token, brand = null } = params
  const url = `${API_HOST}/brands/${brand}/deals?associations=deal.listing,deal.created_by`
  return asyncRequest(getRequest(url, token))
}

export const getEnvelopes = async (params) => {
  const { token, dealId = null } = params
  const url = `${API_HOST}/deals/${dealId}/envelopes`
  return asyncRequest(getRequest(url, token))
}

export const getSubmissions = async (params) => {
  const { token, dealId = null } = params
  const url = `${API_HOST}/deals/${dealId}/submissions`
  return asyncRequest(getRequest(url, token))
}

export const setReview = async (params) => {
  const { id, token, body } = params
  const url = `${PROXY_HOST}/api/concierge/reviews/${id}/edit?access_token=${token}`
  return asyncRequest(postRequest(url, body))
}