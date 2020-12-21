import React from 'react'
import { useSelector } from 'react-redux'
import { withRouter } from 'react-router'

import { IAppState } from 'reducers'
import { getActiveTeamId } from 'utils/user-teams'
import { useLoadingEntities } from 'hooks/use-loading'

import Layout from './Layout'
import Info from './Sections/Info'
import Listings from './Sections/Listings'
import { openListingPage, openSearchResultPage } from './helpers'
import { useBrandListings, useDealsListings } from './hooks'

export function AgentNetwork() {
  const user = useSelector<IAppState, IUser>(state => state.user)

  const brand = getActiveTeamId(user)
  const brandListings = useBrandListings(brand)
  const brandListingsIds = brandListings?.map(listing => listing.id)
  const dealsListings = useDealsListings(brandListingsIds)

  const [isLoadingBrandListings] = useLoadingEntities(brandListings)
  const [isLoadingDealsListings] = useLoadingEntities(dealsListings)

  const listings =
    brandListings && dealsListings ? [...dealsListings, ...brandListings] : null

  return (
    <Layout title="Agent Network" onSelectSearchResult={openSearchResultPage}>
      <Info />
      <Listings
        isLoading={isLoadingBrandListings || isLoadingDealsListings}
        listings={listings}
        onSelectListing={openListingPage}
      />
    </Layout>
  )
}

export default withRouter(AgentNetwork)
