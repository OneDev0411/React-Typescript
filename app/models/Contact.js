import agent from 'superagent'
import _ from 'underscore'
import config from '../../config/public'

const Contact = {}

Contact.getContacts = async function(params) {
  const { access_token } = params
  const endpoint = `${api_host}/contacts`

  try {
    const response = await agent
      .get(endpoint)
      .set({ Authorization: `Bearer ${access_token}` })

    return response
  } catch (e) {
    throw e
  }
}

// set api host
const api_host = config.api_url

export default Contact
