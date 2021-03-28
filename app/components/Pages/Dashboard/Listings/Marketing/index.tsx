import { WithRouterProps } from 'react-router'

import ListingMarketing from 'components/ListingMarketing'
import PageLayout from 'components/GlobalPageLayout'

interface Props {}

export default function ListingMarketingPage({
  params,
  location
}: Props & WithRouterProps) {
  const listingId: UUID = params.id
  const templateType: Optional<IMarketingTemplateType> = location.query.type
  const title: string = location.query.title ?? 'Listing Marketing'

  return (
    <PageLayout>
      <PageLayout.Header title={title} />
      <PageLayout.Main>
        <ListingMarketing
          listingId={listingId}
          defaultTemplateType={templateType}
        />
      </PageLayout.Main>
    </PageLayout>
  )
}
