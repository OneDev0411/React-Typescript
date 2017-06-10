import Fetch from '../../../services/fetch'

const toggleFavorite = async (user = {}, recId, favorite) => {
  const { personal_room } = user

  if (!personal_room || !recId || typeof favorite !== 'boolean') {
    return
  }

  try {
    const response = await new Fetch()
      .patch(`/rooms/${personal_room}/recs/${recId}/favorite`)
      .send({ favorite })

    return response.body.data.status
  } catch (error) {
    throw error
  }
}

export default toggleFavorite