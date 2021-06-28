import React from 'react'

import { withRouter } from 'react-router'

import useActiveBrandListings from '@app/hooks/use-active-brand-listings'

import Layout from './Layout'
import Info from './Sections/Info'
import Listings from './Sections/Listings'
import { openListingPage, openSearchResultPage } from './helpers'

export function AgentNetwork() {
  const { listings, isLoading } = useActiveBrandListings()

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
