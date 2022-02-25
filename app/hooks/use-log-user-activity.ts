import { useSelector } from 'react-redux'
import { useEffectOnce } from 'react-use'

import { logUserActivity } from '@app/models/user/log-activity'
import { selectUserUnsafe } from 'selectors/user'

export function useLogUserActivity(
  userActivity: TUserActivity,
  isIpNeeded: boolean = false
) {
  const user = useSelector(selectUserUnsafe)

  useEffectOnce(() => {
    if (user) {
      try {
        logUserActivity(userActivity, isIpNeeded)
      } catch (error) {
        console.error(error)
      }
    }
  })
}
