import { withRouter } from 'react-router'

import useBrandAndDealsListings from '@app/hooks/use-brand-and-deals-listings'

import { openListingPage, openSearchResultPage } from './helpers'
import Layout from './Layout'
import Info from './Sections/Info'
import Listings from './Sections/Listings'

export function AgentNetwork() {
  const { listings, isLoading } = useBrandAndDealsListings()

  return (
    <Layout title="Agent Network" onSelectSearchResult={openSearchResultPage}>
      <Info />
      <Listings
        isLoading={isLoading}
        listings={listings}
        onSelectListing={openListingPage}
      />
    </Layout>
  )
}

export default withRouter(AgentNetwork)
