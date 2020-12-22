import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'
import { selectUserHasAccess } from 'selectors/acl'
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
): void {
  const hasAccess = useAcl(access, options)

  if (!hasAccess) {
    goTo(fallbackUrl)
  }
}
