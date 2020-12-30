import React from 'react'
import { useSelector } from 'react-redux'

import { selectUserUnsafe } from 'selectors/user'
import logUserActivity from 'models/user/post-new-activity'

export function useLogUserActivity(activityObjectId?: UUID) {
  const user = useSelector(selectUserUnsafe)

  React.useEffect(() => {
    if (activityObjectId && user) {
      logUserActivity({
        object: activityObjectId,
        object_class: 'listing',
        action: 'UserViewedListing'
      })
    }
  }, [activityObjectId, user])
}
