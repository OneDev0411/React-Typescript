import Fetch from '../../../services/fetch'

async function getCalendar(
  low,
  high,
  filter = [],
  deal = undefined,
  contact = undefined
) {
  try {
    const query = {
      low,
      high,
      deal,
      contact,
      'users[]': filter
    }

    const response = await new Fetch().get('/calendar').query(query)

    return response.body && response.body.data
  } catch (e) {
    console.log(e)
  }
}

export default getCalendar
