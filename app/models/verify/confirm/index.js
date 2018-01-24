import Fetch from '../../../services/fetch'

/**
 * Verify Email and Phone Number
 * @param {object} // contain verify type and request body
 */
const verify = async params => {
  const { body, verifyType } = params

  if (!body || !verifyType) {
    return 600
  }

  try {
    const response = await new Fetch()
      .patch(`/users/${verifyType}_confirmed`)
      .send(body)

    return response.body.data
  } catch ({ status }) {
    throw status
  }
}

export default verify
