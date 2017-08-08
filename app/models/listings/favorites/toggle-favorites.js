import Fetch from '../../../services/fetch'
import createRecommendation from '../../recommendation/create-recs'

const toggleFavorite = async ({ roomId, recId, mlsNumber, isFavorite }) => {
  if (!roomId) {
    return
  }

  try {
    if (!recId) {
      recId = await createRecommendation({
        mls_number: mlsNumber,
        room: roomId
      })
    }

    const response = await new Fetch()
      .patch(`/rooms/${roomId}/recs/${recId}/favorite`)
      .send({
        favorite: !isFavorite
      })

    return response.body.code
  } catch (error) {
    throw error
  }
}

export default toggleFavorite
