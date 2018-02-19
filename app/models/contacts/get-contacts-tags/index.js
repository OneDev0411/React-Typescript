import Fetch from '../../../services/fetch'

async function fetchContactsTags() {
  try {
    const response = await new Fetch().get('/contacts/tags')

    return response.body
  } catch (error) {
    throw error
  }
}

export default fetchContactsTags
