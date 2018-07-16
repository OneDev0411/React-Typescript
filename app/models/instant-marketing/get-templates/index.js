// models/template/index.js
import Fetch from '../../../services/fetch'

export const getTemplates = async () => {
  try {
    const response = await new Fetch().get('/templates')

    return response.body.data
  } catch (e) {
    throw e
  }
}
