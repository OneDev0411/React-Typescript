import { useEffect } from 'react'

import { useSelector } from 'react-redux'
import { useLocation } from 'react-use'

import { useUnsafeActiveTeam } from '@app/hooks/team/use-unsafe-active-team'
import { useUnsafeUser } from '@app/hooks/use-unsafe-user'
import { selectUserIsSignedIn } from 'selectors/user'
import { goTo } from 'utils/go-to'

import { hasAccess } from './helpers'
import { Access } from './types'

export function useAcl(access: Access | Access[]): boolean {
  const user = useUnsafeUser()
  const activeTeam = useUnsafeActiveTeam()

  if (!activeTeam) {
    return false
  }

  const userHasNeededAccess = ([] as Access[])
    .concat(access)
    .every(accessItem => hasAccess({ team: activeTeam, user }, accessItem))

  return userHasNeededAccess
}

export function useAclRedirect(
  access: Access | Access[],
  fallbackUrl: string = '/dashboard/mls'
): boolean {
  const hasAccess = useAcl(access)
  const isSignedIn = useSelector(selectUserIsSignedIn)
  const location = useLocation()

  const finalRedirect = isSignedIn
    ? fallbackUrl
    : `/signin?redirectTo=${location.pathname}`

  useEffect(() => {
    if (!hasAccess) {
      goTo(finalRedirect)
    }
  }, [hasAccess, finalRedirect])

  return hasAccess
}
