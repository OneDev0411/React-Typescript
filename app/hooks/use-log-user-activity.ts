import React from 'react'
import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'
import logUserActivity from 'models/user/post-new-activity'

export function useLogUserActivity(activityObjectId?: UUID) {
  const user = useSelector<IAppState, IUser>((state: IAppState) => state.user)

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
