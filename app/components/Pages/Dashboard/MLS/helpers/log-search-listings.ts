import { logUserActivity } from '@app/models/user/log-activity'

export const logSearchListings = async (title: string) => {
  try {
    await logUserActivity(
      {
        action: 'UserSearchedListings',
        object_class: 'UserActivitySearchListings',
        object: {
          title,
          type: 'user_activity_search_listings'
        }
      },
      true
    )
  } catch (error) {
    console.log(error)
  }
}
