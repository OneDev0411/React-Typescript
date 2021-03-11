import React from 'react'
import { WithRouterProps } from 'react-router'

import ListingMarketing from 'components/ListingMarketing'
import PageLayout from 'components/GlobalPageLayout'

interface Props {}

export default function ListingMarketingPage({
  params
}: Props & WithRouterProps) {
  const listingId: UUID = params.id
  const templateType: Optional<IMarketingTemplateType> = params.type as any

  return (
    <PageLayout>
      <PageLayout.Header title="Listing Marketing" />
      <PageLayout.Main>
        <ListingMarketing
          listingId={listingId}
          defaultTemplateType={templateType}
        />
      </PageLayout.Main>
    </PageLayout>
  )
}
