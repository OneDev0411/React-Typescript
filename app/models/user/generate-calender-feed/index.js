import Fetch from '../../../services/fetch'

const getCalenderFeed = async (types, brandId) => {
  let url = `/calendar/feed?types[]=${types.join('&ids[]=')}`

  if (brandId) {
    url += `&brandId=${brandId}`
  }

  try {
    const response = await new Fetch().get(url)

    return response.body.data
  } catch (e) {
    throw e
  }
}

export default getCalenderFeed
