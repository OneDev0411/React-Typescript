// models/template/index.js
import URL from 'url'
import Fetch from '../../services/fetch'
import config from '../../../config/public'

const getAll = async () => {
  try {
    const response = await new Fetch().get('/templates')
    return response.body.data
  } catch ({ status }) {
    throw status
  }
}

export default { getAll }
