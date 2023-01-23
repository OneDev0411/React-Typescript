import Fetch from '../../services/fetch'

export async function getNotificationBadges(
  brandId: UUID
): Promise<INotificationBadges> {
  try {
    const response = await new Fetch().get(
      `/brands/${brandId}/notifications/badges`
    )

    return response.body.data
  } catch (e) {
    throw e
  }
}
