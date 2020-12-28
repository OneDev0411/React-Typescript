import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-use'

import { IAppState } from 'reducers'
import { selectUserHasAccess } from 'selectors/acl'
import { selectUserIsSignedIn } from 'selectors/user'
import { goTo } from 'utils/go-to'

import { Access, UseAclOptions } from './types'

export function useAcl(
  access: Access | Access[],
  options?: UseAclOptions
): boolean {
  return useSelector((state: IAppState) =>
    selectUserHasAccess(state, access, options?.accessControlPolicy)
  )
}

export function useAclRedirect(
  access: Access,
  fallbackUrl: string = '/dashboard/mls',
  options?: UseAclOptions
): boolean {
  const hasAccess = useAcl(access, options)
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
