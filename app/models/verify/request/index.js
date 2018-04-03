import Fetch from '../../../services/fetch'

/**
 * post a verify request for email or phone number
 * @param {String} // verify type: email or phone
 */
const requestVerify = async type => {
  try {
    const response = await new Fetch().post(`/${type}_verifications`)

    return response.statusCode
  } catch ({ status }) {
    throw status
  }
}

export default requestVerify
