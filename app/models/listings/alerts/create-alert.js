import Fetch from '../../../services/fetch'

const createAlert = async alertOptions => {
  try {
    const response = await new Fetch()
      .post(`/rooms/${alertOptions.room}/alerts`)
      .send({ ...alertOptions })

    return response.body.data
  } catch (error) {
    throw error
  }
}

export default createAlert
