import PageLayout from '@app/views/components/GlobalPageLayout'

import ListingsList from './ListingsList'

function Listings() {
  return (
    <PageLayout position="relative" overflow="hidden">
      <PageLayout.Header title="Listings" />
      <PageLayout.Main>
        <ListingsList />
      </PageLayout.Main>
    </PageLayout>
  )
}

export default Listings
