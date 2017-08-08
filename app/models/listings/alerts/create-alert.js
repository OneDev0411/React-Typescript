import Fetch from '../../../services/fetch'

const createAlert = async alert => {
  try {
    const response = await new Fetch()
      .post(`/rooms/${alert.room}/alerts`)
      .send({ ...alert })

    return response.body.data
  } catch (error) {
    throw error
  }
}

export default createAlert
