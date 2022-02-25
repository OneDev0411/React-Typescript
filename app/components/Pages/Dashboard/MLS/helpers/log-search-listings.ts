import { logUserActivity } from '@app/models/user/log-activity'

export const logSearchListings = async (title: string) => {
  try {
    await logUserActivity(
      {
        action: 'UserSearchedListings',
        object_sa: {
          title
        }
      },
      true
    )
  } catch (error) {
    console.log(error)
  }
}
