import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { withRouter } from 'react-router'

import { getActiveTeamId } from 'utils/user-teams'
import { getBrandListings } from 'models/listings/search/get-brand-listings'
import { useLoadingEntities } from 'hooks/use-loading'

import { selectUser } from 'selectors/user'

import Layout from './Layout'
import Info from './Sections/Info'
import Listings from './Sections/Listings'
import { openListingPage, openSearchResultPage } from './helpers'

export function AgentNetwork() {
  const user = useSelector(selectUser)
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
