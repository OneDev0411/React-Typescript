import config from '../../../../config'

const API_URL = config.live_by_api_url
export const NEIGHBORHOODS_API_URL = `${API_URL}/neighborhoods`
export const NEIGHBORHOOD_REPORT_API_URL = `${API_URL}/report`

export const API_CLIENT_ID = config.live_by_api_client_id
export const API_KEY = config.live_by_api_key

export const REQUEST_TIMEOUT_MS = 60000
