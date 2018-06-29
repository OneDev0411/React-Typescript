import Fetch from '../../services/fetch'

export async function getCalendar(low, high) {
  try {
    const response = await new Fetch()
      .get('/calendar')
      .query({ low })
      .query({ high })

    return response.body && response.body.data
  } catch (e) {
    console.log(e)
  }
}
