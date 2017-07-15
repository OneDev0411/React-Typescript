import _ from 'underscore'
import config from '../../config/public'
import Fetch from '../services/fetch'

const Deals = {}

/**
* get deals list
*/
Deals.getAll = async function(user = {}) {
  const { access_token } = user

  try {
    const fetchDeals = new Fetch()
      .get('/deals')

    // required on ssr
    if (access_token) {
      fetchDeals.set({ Authorization: `Bearer ${access_token}` })
    }

    const response = await fetchDeals
    return response.body.data

  } catch (e) {
    console.log(e)
  }
}


export default Deals
