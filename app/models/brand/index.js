// models/brand/index.js
import URL from 'url'
import Fetch from '../../services/fetch'
import config from '../../../config/public'

const getBrand = async hostname => {
  const appHostName = URL.parse(config.app.url).hostname
  if (hostname === appHostName) {
    return null
  }

  try {
    const response = await new Fetch().get(
      `/brands/search?hostname=${hostname}`
    )
    return response.body.data
  } catch (error) {
    throw error
  }
}

export default getBrand
