import Fetch from '../../../services/fetch'

const getCalenderFeedSetting = async () => {
  try {
    const response = await new Fetch().get('/calendar/feed/setting')

    return response.body.data
  } catch (e) {
    throw e
  }
}

export default getCalenderFeedSetting
