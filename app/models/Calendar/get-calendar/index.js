import Fetch from '../../../services/fetch'

export async function getCalendar(low, high, filter = []) {
  try {
    const response = await new Fetch()
      .get('/calendar')
      .query({ low })
      .query({ high })
      .query({ users: filter })

    return response.body && response.body.data
  } catch (e) {
    console.log(e)
  }
}
