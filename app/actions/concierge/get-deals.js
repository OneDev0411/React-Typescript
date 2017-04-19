
import { getDeals } from '../../models/Concierge'
import AppStore from '../../stores/AppStore'

export default async function (user) {
  const params = {
    brand: user.brand,
    token: user.access_token
  }
  try {
    const deals = await getDeals(params)
    AppStore.data.conciergeDeals = {
      deals,
      isUpdated: false
    }
    AppStore.emitChange()
  } catch (error) {
    throw error
  }
}