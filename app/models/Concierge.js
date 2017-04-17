import 'whatwg-fetch'
import config from '../../config/public'

// set api host
const API_HOST = config.api_url

const asyncFetch = async (url, token) => {
  try {
    const response = await fetch(url, {
      headers: new Headers({
        Authorization: `Bearer ${token}`
      })
    })
    if (response.status >= 200 && response.status < 300) {
      const parsedResponse = await response.json()
      return parsedResponse.data
    }
    const error = new Error(response.statusText)
    console.log(`getBrandDeals: ${error}`)
    throw error
  } catch (error) {
    console.log(`getBrandDeals: ${error}`)
    throw error
  }
}

export const getDeals = (params) => {
  const { token, brand = null } = params
  const url = `${API_HOST}/brands/${brand}/deals?associations=deal.listing,deal.created_by`
  return asyncFetch(url, token)
}

export const getEnvelopes = async (params) => {
  const { token, dealId = null } = params
  const url = `${API_HOST}/deals/${dealId}/envelopes`
  return asyncFetch(url, token)
}

export const getSubmissions = async (params) => {
  const { token, dealId = null } = params
  const url = `${API_HOST}/deals/${dealId}/submissions`
  return asyncFetch(url, token)
}