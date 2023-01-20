import Fetch from '../../services/fetch'

export async function getNotificationsBadges(
  brandId: UUID
): Promise<INotificationsBadges> {
  try {
    const response = await new Fetch().put(
      `/brands/${brandId}/notifications/badges`
    )

    return response.body.data
  } catch (e) {
    throw e
  }
}
