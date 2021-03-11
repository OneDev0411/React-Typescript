import React from 'react'
import { WithRouterProps } from 'react-router'

import ListingMarketing from 'components/ListingMarketing'
import PageLayout from 'components/GlobalPageLayout'

interface Props {}

export default function ListingMarketingPage({
  params
}: Props & WithRouterProps) {
  const listingId: UUID = params.id

  return (
    <PageLayout>
      <PageLayout.Header title="Listing Marketing" />
      <PageLayout.Main>
        <ListingMarketing listingId={listingId} />
      </PageLayout.Main>
    </PageLayout>
  )
}
