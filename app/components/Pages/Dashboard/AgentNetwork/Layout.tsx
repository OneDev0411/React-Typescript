import React from 'react'
import { useTitle } from 'react-use'
import { Box } from '@material-ui/core'

import { ACL } from 'constants/acl'
import Acl from 'components/Acl'
import PageLayout from 'components/GlobalPageLayout'
import ListingsAndPlacesSearchInput from 'components/ListingsAndPlacesSearchInput'
import { SearchResult } from 'components/ListingsAndPlacesSearchInput/types'

interface Props {
  title?: string
  noGlobalActionsButton?: boolean
  onSelectSearchResult: (result: SearchResult) => void
  children: React.ReactNode
}

export default function AgentNetworkLayout({
  title,
  onSelectSearchResult,
  children
}: Props) {
  useTitle('Agent Network | Rechat')

  return (
    <Acl access={[ACL.AGENT_NETWORK]} fallbackUrl="/dashboard/mls">
      <PageLayout>
        <PageLayout.Header title={title}>
          <Box width="100%" maxWidth={360}>
            <ListingsAndPlacesSearchInput onSelect={onSelectSearchResult} />
          </Box>
        </PageLayout.Header>
        <PageLayout.Main>{children}</PageLayout.Main>
      </PageLayout>
    </Acl>
  )
}
