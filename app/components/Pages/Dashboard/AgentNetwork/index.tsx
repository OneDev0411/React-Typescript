import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { withRouter } from 'react-router'

import { IAppState } from 'reducers'
import { getActiveTeamId } from 'utils/user-teams'
import { getBrandListings } from 'models/listings/search/get-brand-listings'
import { useLoadingEntities } from 'hooks/use-loading'
import { goTo } from 'utils/go-to'

import Layout from './Layout'
import Info from './Sections/Info'
import Listings from './Sections/Listings'

export function AgentNetwork() {
  const user = useSelector<IAppState, IUser>(state => state.user)
  const [listings, setListings] = useState<Nullable<ICompactListing[]>>(null)
  const [isLoading, setIsLoading] = useLoadingEntities(listings)
  const brand = getActiveTeamId(user)

  useEffect(() => {
    async function fetchBrandListings() {
      if (!brand) {
        return
      }

      try {
        const brandListings = await getBrandListings(brand)

        setListings(brandListings)
      } catch (error) {
        setIsLoading(false)
        console.error(error)
      }
    }

    fetchBrandListings()
  }, [brand, setIsLoading])

  async function handleSelectListing(listing: ICompactListing) {
    goTo('/dashboard/agent-network/agents', null, {
      listing: listing.id
    })
  }

  return (
    <Layout>
      <Info />
      <Listings
        isLoading={isLoading}
        listings={listings}
        onListingClick={handleSelectListing}
        onSeeAllClick={console.log}
      />
    </Layout>
  )
}

export default withRouter(AgentNetwork)
