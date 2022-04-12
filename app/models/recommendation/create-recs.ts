import Fetch from '../../services/fetch'

interface CreateRecommendationOptions {
  listing_id: UUID
  room: UUID
  notification?: boolean
}

const createRecommendation = async ({
  listing_id,
  room,
  notification
}: CreateRecommendationOptions): Promise<UUID> => {
  try {
    const response = await new Fetch()
      .post(`/rooms/${room}/recs`)
      .send({ listing_id, notification })

    return response.body.data.id
  } catch (error) {
    throw error
  }
}

export default createRecommendation
