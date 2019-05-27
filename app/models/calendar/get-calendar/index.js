import Fetch from '../../../services/fetch'

async function getCalendar(
  low,
  high,
  users = [],
  filterBy = {},
  associations = []
) {
  try {
    const query = {
      low,
      high,
      'users[]': users,
      ...filterBy,
      associations
    }

    const response = await new Fetch().get('/calendar').query(query)

    return response.body && response.body.data
  } catch (e) {
    console.log(e)
  }
}

export default getCalendar
