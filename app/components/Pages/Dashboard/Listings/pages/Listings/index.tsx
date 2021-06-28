import { WithRouterProps } from 'react-router'

import PageLayout from '@app/views/components/GlobalPageLayout'

import ListingsTabs, { ListingsTabsProps } from './ListingsTabs'
import { listingTabs } from '../../constants'
import ListingsList from './ListingsList'

type ListingsProps = WithRouterProps<{ type?: ListingsTabsProps['type'] }, {}>

function Listings({ params }: ListingsProps) {
  const type = params.type || listingTabs.MyListings

  return (
    <PageLayout position="relative" overflow="hidden">
      <PageLayout.Header title="Listings" />
      <PageLayout.Main>
        <ListingsTabs type={type} />
        <ListingsList type={type} />
      </PageLayout.Main>
    </PageLayout>
  )
}

export default Listings
