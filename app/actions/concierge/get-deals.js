
import { getDeals } from '../../models/Concierge'
import AppStore from '../../stores/AppStore'

export default async function (user) {
  const params = {
    brand: user.brand,
    token: user.access_token
  }
  try {
    AppStore.data.conciergeDeals = await getDeals(params)
    AppStore.emitChange()
  } catch (error) {
    console.log(`get-deals: ${error}`)
    throw error
  }
}