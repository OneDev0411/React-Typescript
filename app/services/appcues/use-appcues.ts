import { useMemo, useEffect, useState } from 'react'

import { useSelector } from 'react-redux'
import { useLocation } from 'react-use'

import { useUnsafeActiveBrand } from '@app/hooks/brand/use-unsafe-active-brand'
import { OAuthProvider } from 'constants/contacts'
import { getOAuthAccounts } from 'models/o-auth-accounts/get-o-auth-accounts'
import { selectUserAccessList, selectUserUnsafe } from 'selectors/user'

import { prepareAndSendUserData } from './helpers'
import { AppcuesUserInfo } from './types'

interface UserInfoToWatch extends AppcuesUserInfo {
  id: string
}

export function useAppcues() {
  const accessList = useSelector(selectUserAccessList)

  const location = useLocation()
  const user = useSelector(selectUserUnsafe)
  const activeBrand = useUnsafeActiveBrand()

  const [gmailOrOutlookSynced, setGmailOrOutlookSynced] =
    useState<Nullable<boolean>>(null)

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

  // Check if the user is synced with gmail or outlook just once
  useEffect(() => {
    async function checkOAuthAccounts() {
      const google = await getOAuthAccounts(OAuthProvider.Google)
      const outlook = await getOAuthAccounts(OAuthProvider.Outlook)
      const gmailOrOutlookSynced = Boolean(google.length || outlook.length)

      setGmailOrOutlookSynced(gmailOrOutlookSynced)
    }

    if (userInfoToWatch) {
      checkOAuthAccounts()
    }
  }, [userInfoToWatch])

  useEffect(() => {
    // Send user data to Appcues only if the user is logged in and checking OAuth accounts is done
    if (!userInfoToWatch || gmailOrOutlookSynced === null) {
      return
    }

    const { id, ...appcuesUserInfo } = userInfoToWatch

    prepareAndSendUserData(
      activeBrand,
      accessList,
      id,
      appcuesUserInfo,
      gmailOrOutlookSynced
    )
  }, [pathname, userInfoToWatch, accessList, activeBrand, gmailOrOutlookSynced])
}
