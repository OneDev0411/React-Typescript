import React from 'react'

import { ACL } from 'constants/acl'

import Acl from 'components/Acl'
import PageLayout from 'components/GlobalPageLayout'

interface Props {
  children: React.ReactNode
}

export default function AgentNetworkLayout({ children }: Props) {
  return (
    <Acl access={[ACL.MARKETING]}>
      <PageLayout>
        <PageLayout.Header title="Agent Network" />
        <PageLayout.Main>{children}</PageLayout.Main>
      </PageLayout>
    </Acl>
  )
}
