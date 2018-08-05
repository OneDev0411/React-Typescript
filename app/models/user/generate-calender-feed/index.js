import Fetch from '../../../services/fetch'

const getCalenderFeed = async (types, brandId) => {
  try {
    const response = await new Fetch().get(
      `/calendar/feed?types[]=${types.join('&ids[]=')}&brandId=${brandId}`
    )

    return response.body.data
  } catch (e) {
    throw e
  }
}

export default getCalenderFeed
