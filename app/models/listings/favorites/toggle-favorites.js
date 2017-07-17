import Fetch from '../../../services/fetch'

const toggleFavorite = async ({ roomId, recId, mlsNumber, isFavorite }) => {
  if (!roomId) {
    return
  }

  try {
    if (!recId) {
      const rec = await new Fetch()
        .post(`/rooms/${roomId}/recs`)
        .send({ mls_number: mlsNumber })

      recId = rec.body.data.id
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
