import React, { ComponentType } from 'react'

import { useAclRedirect } from './use-acl'
import { Access } from './types'

function withAcl<T = {}>(
  Component: ComponentType<T>,
  access: Access,
  fallbackUrl = '/dashboard/mls'
) {
  return function AclComponent(props: T) {
    const hasAccess = useAclRedirect(access, fallbackUrl)

    return hasAccess ? <Component {...props} /> : null
  }
}

export default withAcl
