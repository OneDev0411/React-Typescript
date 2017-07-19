import Fetch from '../../services/fetch'

const createRecommendation = async ({ mls_number, room }) => {
  try {
    const response = await new Fetch()
      .post(`/rooms/${room}/recs`)
      .send({ mls_number })

    return response.body.data.id
  } catch (error) {
    throw error
  }
}

export default createRecommendation
