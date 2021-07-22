import { useMemo, useEffect } from 'react'

import { useSelector } from 'react-redux'
import { useLocation } from 'react-use'

import { selectUserAccessList, selectUserUnsafe } from 'selectors/user'

import { prepareAndSendUserData } from './helpers'
import { AppcuesUserInfo } from './types'

export function useAppcues() {
  const accessList = useSelector(selectUserAccessList)

  const location = useLocation()
  const user = useSelector(selectUserUnsafe)

  interface UserInfoToWatch extends AppcuesUserInfo {
    id: string
  }

  const userInfoToWatch = useMemo<Nullable<UserInfoToWatch>>(() => {
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

  const pathname = location.pathname

  useEffect(() => {
    if (!userInfoToWatch) {
      return
    }

    const { id, ...appcuesUserInfo } = userInfoToWatch

    prepareAndSendUserData(accessList, id, appcuesUserInfo)
  }, [pathname, userInfoToWatch, accessList])
}
