import Fetch from '../../../services/fetch'
import createRecommendation from '../../recommendation/create-recs'

interface ToggleFavoriteOptions {
  roomId: Nullable<UUID>
  recId: Nullable<UUID>
  listingId: UUID
  isFavorite: boolean
}

const toggleFavorite = async ({
  roomId,
  recId,
  listingId,
  isFavorite
}: ToggleFavoriteOptions): Promise<Optional<number>> => {
  if (!roomId) {
    return undefined
  }

  try {
    if (!recId) {
      recId = await createRecommendation({
        listing_id: listingId,
        room: roomId
      })
    }

    const response = await new Fetch()
      .patch(`/rooms/${roomId}/recs/${recId}/favorite`)
      .send({
        favorite: !isFavorite
      })

    return response.body.code as number
  } catch (error) {
    throw error
  }
}

export default toggleFavorite
