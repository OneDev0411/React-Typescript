import React, { ComponentType } from 'react'

import { ACL } from 'constants/acl'

import { useAclRedirect } from './use-acl'
import { Access } from './types'

function withAcl<T = {}>(
  Component: ComponentType<T>,
  access: Access | Access[],
  fallbackUrl = '/dashboard/mls'
) {
  return function AclComponent(props: T) {
    const hasAccess = useAclRedirect(access, fallbackUrl)

    return hasAccess ? <Component {...props} /> : null
  }
}

function generateWithAcl(access: Access | Access[]) {
  return function withAclDefault<T>(
    Component: ComponentType<T>,
    fallbackUrl?: string
  ) {
    return withAcl<T>(Component, access, fallbackUrl)
  }
}

export default Object.assign(withAcl, {
  crm: generateWithAcl([ACL.CRM]),
  admin: generateWithAcl([ACL.ADMIN]),
  backOffice: generateWithAcl([ACL.BACK_OFFICE]),
  deals: generateWithAcl([ACL.DEALS]),
  marketing: generateWithAcl([ACL.MARKETING]),
  agentNetwork: generateWithAcl([ACL.AGENT_NETWORK]),
  store: generateWithAcl([ACL.STORE]),
  websites: generateWithAcl([ACL.WEBSITES]),
  showings: generateWithAcl([ACL.SHOWINGS])
})
