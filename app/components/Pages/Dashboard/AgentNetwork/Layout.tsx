import React from 'react'
import { useTitle } from 'react-use'

import { ACL } from 'constants/acl'
import Acl from 'components/Acl'
import PageLayout from 'components/GlobalPageLayout'

interface Props {
  title?: string
  children: React.ReactNode
}

export default function AgentNetworkLayout({
  title = 'Agent Network',
  children
}: Props) {
  useTitle('Agent Network | Rechat')

  return (
    <Acl access={[ACL.MARKETING]}>
      <PageLayout>
        <PageLayout.Header title={title} />
        <PageLayout.Main>{children}</PageLayout.Main>
      </PageLayout>
    </Acl>
  )
}
