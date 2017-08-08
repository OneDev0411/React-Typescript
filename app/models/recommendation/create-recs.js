import Fetch from '../../services/fetch'

const createRecommendation = async ({ mls_number, room, notification }) => {
  try {
    const response = await new Fetch()
      .post(`/rooms/${room}/recs`)
      .send({ mls_number, notification })

    return response.body.data.id
  } catch (error) {
    throw error
  }
}

export default createRecommendation
