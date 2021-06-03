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
  const medium: Optional<string> = location.hash.split('#').pop() || undefined

  return (
    <PageLayout>
      <PageLayout.Header title={title} />
      <PageLayout.Main>
        <ListingMarketing
          listingId={listingId}
          defaultTemplateType={templateType}
          defaultMedium={medium as IMarketingTemplateMedium}
        />
      </PageLayout.Main>
    </PageLayout>
  )
}
