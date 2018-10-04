import Fetch from '../../../services/fetch'

const defaultQuery = {
  limit: 50,
  sorting_value: 'Update'
}

export const getSavedSearchListings = async (
  alertId,
  roomId,
  query = defaultQuery
) => {
  if (!alertId) {
    throw new Error('Alert id is missing!')
  }

  if (!roomId) {
    throw new Error('Room id is missing!')
  }

  try {
    const response = await new Fetch()
      .get(`/rooms/${roomId}/recs/feed`)
      .query({ filter: alertId })
      .query(query)

    return response.body
  } catch (error) {
    console.log(error)
    throw error
  }
}
