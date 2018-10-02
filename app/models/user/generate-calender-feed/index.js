import Fetch from '../../../services/fetch'

const getCalenderFeed = async (types, filter) => {
  try {
    const response = await new Fetch()
      .post('/calendar/feed')
      .send({ types, filter })

    return response.body.data
  } catch (e) {
    throw e
  }
}

export default getCalenderFeed
