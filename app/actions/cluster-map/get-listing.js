

import { getListing } from '../../models/Concierge'
import AppStore from '../../stores/AppStore'

export default async function (user, body) {
  const params = {
    body,
    token: user.access_token
  }
  try {
    const markers = await getListing(params) || []
    AppStore.data.clusterMapMarkers = markers
    return markers
  } catch (error) {
    throw error
  }
}
