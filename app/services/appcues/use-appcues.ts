import { useMemo } from 'react'
import { useDeepCompareEffect } from 'react-use'
import { useSelector } from 'react-redux'

import { selectUserAccessList, selectUserUnsafe } from 'selectors/user'
import { IAppState } from 'reducers'

import { AppcuesUserInfo, Location } from './types'
import { prepareAndSendUserData } from './helpers'

export function useAppcues() {
  const accessList = useSelector(selectUserAccessList)

  const location = useSelector<IAppState, Location | null>(
    state => state.data.location
  )
  const user = useSelector(selectUserUnsafe)

  const userInfoToWatch = useMemo<Nullable<AppcuesUserInfo>>(() => {
    return user?.id
      ? {
          id: user.id,
          firstName: user.first_name,
          fullName: user.display_name,
          email: user.email,
          userType: user.user_type,
          createdAt: user.created_at
        }
      : null
  }, [
    user?.id,
    user?.first_name,
    user?.display_name,
    user?.email,
    user?.user_type,
    user?.created_at
  ])

  const pathname = location ? location.pathname : null

  // TODO: Use `useEffect` instead of `useDeepCompareEffect`
  // when store.teams unwanted update is fixed
  // https://gitlab.com/rechat/web/-/issues/5355#note_626397173
  useDeepCompareEffect(() => {
    if (!pathname || !userInfoToWatch) {
      return
    }

    prepareAndSendUserData(accessList, userInfoToWatch)
  }, [pathname, userInfoToWatch, accessList])
}
