import Fetch from '../../../services/fetch'

const updateAlert = async ({ room, id, body }) => {
  try {
    const response = await new Fetch()
      .put(`/rooms/${room}/alerts/${id}`)
      .send(body)

    return response.body.code
  } catch (error) {
    throw error
  }
}

export default updateAlert
